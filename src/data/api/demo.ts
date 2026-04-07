import crypto from 'crypto'
import mongoose from 'mongoose'

import User from '@/data/api/mongo/models/user'
import Chat from '@/data/api/mongo/models/chat'
import ChatMessage from '@/data/api/mongo/models/chat-message'
import MarketListing from '@/data/api/mongo/models/market-listing'
import { ChatMessageType } from '@/types/chats'
import { UserRole } from '@/types/auth'

type SellerSeed = {
  username: string
  country: string
}

const sellerSeeds: SellerSeed[] = [
  { username: 'demo.seller.mei', country: 'hk' },
  { username: 'demo.seller.kai', country: 'jp' },
  { username: 'demo.seller.linh', country: 'kr' },
]

const categories = [
  'jade',
  'ceramics',
  'furniture',
  'textiles',
  'calligraphy',
  'coin',
  'painting',
  'sculpture',
]

const titlePrefixes = [
  'Antique',
  'Collector',
  'Museum-grade',
  'Estate',
  'Handcrafted',
  'Imperial',
  'Vintage',
  'Signed',
]

const listingNouns = [
  'Jade Pendant',
  'Porcelain Vase',
  'Tea Set',
  'Bronze Mirror',
  'Lacquer Box',
  'Silk Scroll',
  'Ink Stone',
  'Bamboo Carving',
]

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const randomPick = <T>(items: T[]) => items[randomInt(0, items.length - 1)]

const randomPriceInCents = () => randomInt(8_000, 450_000)

const toObjectId = (id: mongoose.Types.ObjectId | string) =>
  typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id

async function generateKeyPair() {
  return await crypto.webcrypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-521' },
    true,
    ['deriveKey', 'deriveBits'],
  )
}

async function createSellerIfMissing(seed: SellerSeed) {
  const found = await User.findOne({ username: seed.username })
  if (found) {
    return found
  }

  const keyPair = await generateKeyPair()
  const publicKey = (await crypto.webcrypto.subtle.exportKey(
    'jwk',
    keyPair.publicKey,
  )) as JsonWebKey
  const privateKeyPkcs8 = await crypto.webcrypto.subtle.exportKey(
    'pkcs8',
    keyPair.privateKey,
  )

  return await User.createWithPasskey({
    username: seed.username,
    passkey: crypto.randomBytes(32),
    roles: [UserRole.USER],
    publicKey,
    // Stored for demo-only server-side encryption when auto-generating messages.
    encryptedUserEncryptionKey: Buffer.from(privateKeyPkcs8),
  })
}

async function ensureDemoListings(sellers: Array<Awaited<ReturnType<typeof createSellerIfMissing>>>) {
  const existingCount = await MarketListing.countDocuments({
    author: { $in: sellers.map((seller) => seller._id) },
  })

  if (existingCount >= 24) {
    return
  }

  const docs = []
  for (let i = existingCount; i < 24; i += 1) {
    const seller = randomPick(sellers)
    const title = `${randomPick(titlePrefixes)} ${randomPick(listingNouns)} #${i + 1}`
    const categoryA = randomPick(categories)
    const categoryB = randomPick(categories.filter((c) => c !== categoryA))

    docs.push({
      title,
      description:
        `Curated demo item ${i + 1} for marketplace walkthroughs. ` +
        `Condition: excellent. Provenance notes and close-up photos available.`,
      pictures: [],
      author: seller._id,
      listedAt: new Date(Date.now() - randomInt(1, 14) * 24 * 3600 * 1000),
      priceInCents: randomPriceInCents(),
      countries: [sellerSeeds.find((s) => s.username === seller.username)?.country ?? 'hk'],
      categories: [categoryA, categoryB],
    })
  }

  if (docs.length > 0) {
    await MarketListing.insertMany(docs)
  }
}

async function deriveSharedKey(
  sellerPrivateKeyPkcs8: Buffer,
  guestPublicKey: JsonWebKey,
): Promise<CryptoKey> {
  const sellerPrivateKey = await crypto.webcrypto.subtle.importKey(
    'pkcs8',
    sellerPrivateKeyPkcs8,
    { name: 'ECDH', namedCurve: 'P-521' },
    true,
    ['deriveKey', 'deriveBits'],
  )
  const guestPublic = await crypto.webcrypto.subtle.importKey(
    'jwk',
    guestPublicKey,
    { name: 'ECDH', namedCurve: 'P-521' },
    true,
    [],
  )

  return await crypto.webcrypto.subtle.deriveKey(
    { name: 'ECDH', public: guestPublic },
    sellerPrivateKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  )
}

async function encryptText(sharedKey: CryptoKey, text: string) {
  const iv = crypto.getRandomValues(new Uint8Array(16))
  const ciphertext = await crypto.webcrypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    sharedKey,
    new TextEncoder().encode(text),
  )

  return {
    content: Buffer.from(ciphertext),
    e2e: { iv: Buffer.from(iv) },
  }
}

const encodedMarketListingMessage = (listingId: string) =>
  JSON.stringify({
    type: 'market-listing',
    nonce: crypto.randomBytes(12).toString('base64'),
    data: listingId,
  })

async function ensureDemoChatAndMessages(
  guestUser: { _id: mongoose.Types.ObjectId; username: string; publicKey: JsonWebKey },
  sellers: Array<Awaited<ReturnType<typeof createSellerIfMissing>>>,
) {
  const seller = sellers[0]
  let chat = await Chat.findOne({
    'participants.id': { $all: [guestUser._id, seller._id] },
    $expr: { $eq: [{ $size: '$participants' }, 2] },
  })

  if (!chat) {
    chat = await Chat.create({
      participants: [
        { id: guestUser._id, username: guestUser.username, publicKey: guestUser.publicKey },
        { id: seller._id, username: seller.username, publicKey: seller.publicKey },
      ],
    })
  }

  const existingMessages = await ChatMessage.countDocuments({ chatId: chat._id })
  if (existingMessages > 0) {
    return
  }

  if (!seller.encryptedUserEncryptionKey || !guestUser.publicKey) {
    return
  }

  const sharedKey = await deriveSharedKey(
    seller.encryptedUserEncryptionKey,
    guestUser.publicKey,
  )

  const sellerListings = await MarketListing.find({ author: seller._id }).limit(1)
  const listingId = sellerListings[0]?._id?.toString()

  const messages = [
    `Welcome to Jade Trail, ${guestUser.username}.`,
    'This account is preloaded with demo content so every section has data.',
    listingId
      ? encodedMarketListingMessage(listingId)
      : 'Open Marketplace to browse a curated set of sample listings.',
    'Try creating your own listing and opening a new chat to complete the walkthrough.',
  ]

  const created: Array<{
    chatId: mongoose.Types.ObjectId
    sender: mongoose.Types.ObjectId
    type: ChatMessageType
    content: Buffer
    e2e: { iv: Buffer }
    sentAt: Date
  }> = []

  for (let i = 0; i < messages.length; i += 1) {
    const encrypted = await encryptText(sharedKey, messages[i])
    created.push({
      chatId: toObjectId(chat._id),
      sender: toObjectId(seller._id),
      type: ChatMessageType.Text,
      content: encrypted.content,
      e2e: { iv: encrypted.e2e.iv },
      sentAt: new Date(Date.now() - (messages.length - i) * 90_000),
    })
  }

  await ChatMessage.insertMany(created)
}

export async function provisionDemoDataForUser(guestUserId: mongoose.Types.ObjectId | string) {
  const guestUser = await User.findById(guestUserId)
  if (!guestUser || !guestUser.publicKey) {
    return
  }

  const sellers = []
  for (const seed of sellerSeeds) {
    sellers.push(await createSellerIfMissing(seed))
  }

  await ensureDemoListings(sellers)
  await ensureDemoChatAndMessages(guestUser, sellers)
}
