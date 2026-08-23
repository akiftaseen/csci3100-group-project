import type { MarketListingSearchResult, SearchMarketListingsOptions } from '@/types/market'
import { ChatMessageType, type ClientChat, type ClientChatMessage } from '@/types/chats'
import type { PaginatedResult } from '@/types/common'

export const DEMO_USER = {
  id: '66f000000000000000000001',
  username: 'jade.explorer',
}

const id = (value: string) => value
const hoursAgo = (hours: number) =>
  new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

const sellers = {
  mei: { id: id('66f000000000000000000101'), username: 'mei.antiques', publicKey: {} as JsonWebKey },
  kai: { id: id('66f000000000000000000102'), username: 'kai.collects', publicKey: {} as JsonWebKey },
  linh: { id: id('66f000000000000000000103'), username: 'linh.studio', publicKey: {} as JsonWebKey },
  sora: { id: id('66f000000000000000000104'), username: 'sora.curates', publicKey: {} as JsonWebKey },
}

export const demoListings: MarketListingSearchResult[] = [
  {
    id: id('66f100000000000000000001'),
    title: 'Southern Song Celadon Vase',
    description: 'Stoneware vase with a smooth jade-like celadon glaze and delicate icy crackle. A serene statement piece with museum-quality presence.',
    pictures: ['https://collectionapi.metmuseum.org/api/collection/v1/iiif/52611/1415163/main-image'], author: sellers.mei, listedAt: hoursAgo(2),
    priceInCents: 28500, countries: ['hk'], categories: ['ceramics'],
  },
  {
    id: id('66f100000000000000000002'),
    title: 'Carved Jade Bi Disc',
    description: 'Translucent nephrite disc with hand-carved cloud motifs. A refined collector piece in excellent condition.',
    pictures: ['https://collectionapi.metmuseum.org/api/collection/v1/iiif/74526/155457/main-image'], author: sellers.kai, listedAt: hoursAgo(5),
    priceInCents: 42000, countries: ['jp'], categories: ['jade', 'sculpture'],
  },
  {
    id: id('66f100000000000000000003'),
    title: 'Indigo Tea Ceremony Cloth',
    description: 'Handwoven linen textile dyed in layered indigo. Finished with a traditional sashiko border and natural variations.',
    pictures: ['https://collectionapi.metmuseum.org/api/collection/v1/iiif/70748/106994/main-image'], author: sellers.linh, listedAt: hoursAgo(9),
    priceInCents: 12800, countries: ['kr'], categories: ['textiles'],
  },
  {
    id: id('66f100000000000000000004'),
    title: 'Scholar’s Ink Stone',
    description: 'Fine-grained stone with a hand-polished ink well and pine relief. Includes fitted paulownia presentation box.',
    pictures: ['https://collectionapi.metmuseum.org/api/collection/v1/iiif/41869/1673872/main-image'], author: sellers.sora, listedAt: hoursAgo(18),
    priceInCents: 19600, countries: ['sg'], categories: ['calligraphy'],
  },
  {
    id: id('66f100000000000000000005'),
    title: 'Qing Bronze Incense Burner',
    description: 'Compact eighteenth-century bronze incense burner with a warm, naturally aged patina and finely modeled details.',
    pictures: ['https://collectionapi.metmuseum.org/api/collection/v1/iiif/61000/1518736/main-image'], author: sellers.mei, listedAt: hoursAgo(28),
    priceInCents: 36500, countries: ['hk'], categories: ['sculpture'],
  },
  {
    id: id('66f100000000000000000006'),
    title: 'Mountain Mist Silk Scroll',
    description: 'Contemporary ink landscape mounted on silk brocade. Signed and sealed by the artist, ready for hanging.',
    pictures: ['https://collectionapi.metmuseum.org/api/collection/v1/iiif/51552/2232563/main-image'], author: sellers.kai, listedAt: hoursAgo(35),
    priceInCents: 54000, countries: ['jp'], categories: ['painting', 'calligraphy'],
  },
  {
    id: id('66f100000000000000000007'),
    title: 'Lacquer Keepsake Box',
    description: 'Deep cinnabar lacquer box with a hand-painted botanical interior. Restored brass clasp and velvet lining.',
    pictures: ['https://collectionapi.metmuseum.org/api/collection/v1/iiif/60927/130046/main-image'], author: sellers.linh, listedAt: hoursAgo(51),
    priceInCents: 17200, countries: ['kr'], categories: ['furniture'],
  },
  {
    id: id('66f100000000000000000008'),
    title: 'Song-style Tea Bowl',
    description: 'Stoneware bowl with an expressive iron glaze and silver leaf repair. Balanced weight for daily tea practice.',
    pictures: ['https://collectionapi.metmuseum.org/api/collection/v1/iiif/51074/1902914/main-image'], author: sellers.sora, listedAt: hoursAgo(69),
    priceInCents: 14800, countries: ['sg'], categories: ['ceramics'],
  },
]

const me = { id: DEMO_USER.id, username: DEMO_USER.username, publicKey: {} as JsonWebKey }
const message = (idValue: string, sender: string, content: string, sentAt: string): ClientChatMessage => ({
  id: idValue, sender, type: ChatMessageType.Text, content, sentAt,
})

const demoMessagesByChat: Record<string, ClientChatMessage[]> = {
  'demo-chat-mei': [
    message('mei-1', sellers.mei.id.toString(), 'Hi! The celadon moon jar is still available.', hoursAgo(4)),
    message('mei-2', DEMO_USER.id, 'Lovely. Does it have any chips or restoration?', hoursAgo(3.5)),
    message('mei-3', sellers.mei.id.toString(), 'No chips or repairs. I can send close-ups of the foot ring this evening.', hoursAgo(3)),
    message('mei-4', DEMO_USER.id, 'Perfect — I’d appreciate that. Would you also consider HK$260?', hoursAgo(2.2)),
    message('mei-5', sellers.mei.id.toString(), 'I can meet you at HK$270 and include the display stand.', hoursAgo(1.8)),
  ],
  'demo-chat-kai': [
    message('kai-1', DEMO_USER.id, 'Hello Kai, can you tell me more about the jade disc’s provenance?', hoursAgo(21)),
    message('kai-2', sellers.kai.id.toString(), 'Of course. It came from a Kyoto estate collection assembled in the 1980s.', hoursAgo(20)),
    message('kai-3', sellers.kai.id.toString(), 'I also have the original collection card and recent gemology report.', hoursAgo(19.5)),
    message('kai-4', DEMO_USER.id, 'That sounds great. Could you reserve it until tomorrow?', hoursAgo(18)),
  ],
  'demo-chat-linh': [
    message('linh-1', sellers.linh.id.toString(), 'Thanks for saving the indigo cloth. The color is even richer in daylight.', hoursAgo(30)),
    message('linh-2', DEMO_USER.id, 'The stitching is beautiful. Is local pickup possible this weekend?', hoursAgo(29)),
    message('linh-3', sellers.linh.id.toString(), 'Yes — Saturday afternoon works for me.', hoursAgo(26)),
  ],
  'demo-chat-sora': [
    message('sora-1', DEMO_USER.id, 'Is the ink stone suitable for regular use, or mainly display?', hoursAgo(58)),
    message('sora-2', sellers.sora.id.toString(), 'It is fully usable. The stone has a very smooth grind and holds water well.', hoursAgo(55)),
    message('sora-3', DEMO_USER.id, 'Wonderful, thank you for confirming.', hoursAgo(53)),
  ],
}

let demoSharedKey: Promise<CryptoKey> | undefined
export const getDemoSharedKey = () => {
  demoSharedKey ??= globalThis.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'],
  )
  return demoSharedKey
}

const chatSeed = [
  { id: 'demo-chat-mei', seller: sellers.mei },
  { id: 'demo-chat-kai', seller: sellers.kai },
  { id: 'demo-chat-linh', seller: sellers.linh },
  { id: 'demo-chat-sora', seller: sellers.sora },
]

export async function getDemoChats(): Promise<PaginatedResult<ClientChat & { sharedKey: CryptoKey }>> {
  const sharedKey = await getDemoSharedKey()
  const data = chatSeed.map((chat) => {
    const messages = demoMessagesByChat[chat.id]
    return {
      id: chat.id,
      participants: [me, { ...chat.seller, id: chat.seller.id.toString() }],
      lastMessage: messages[messages.length - 1],
      wasRequestedToDelete: false,
      sharedKey,
    }
  })
  return { data, meta: { total: data.length, skip: 0, limit: 10 } }
}

export async function getDemoChat(chatId: string) {
  const chats = await getDemoChats()
  const chat = chats.data.find((item) => item.id === chatId)
  if (!chat) throw new Error('Demo chat not found')
  return chat
}

export async function getDemoChatByRecipient(recipientId: string) {
  const chats = await getDemoChats()
  const chat = chats.data.find((item) =>
    item.participants.some((participant) => participant.id === recipientId),
  )
  if (!chat) throw new Error('Demo chat not found')
  return chat
}

export function getDemoMessages(chatId: string): PaginatedResult<ClientChatMessage> {
  const data = demoMessagesByChat[chatId] ?? []
  return { data: [...data], meta: { total: data.length, skip: 0, limit: 100 } }
}

export function addDemoMessage(chatId: string, sender: string, content: string) {
  const messages = demoMessagesByChat[chatId]
  if (!messages) return
  messages.push(message(`demo-${Date.now()}`, sender, content, new Date().toISOString()))
}

export function searchDemoListings(options: SearchMarketListingsOptions = {}): PaginatedResult<MarketListingSearchResult> {
  let data = [...demoListings]
  const query = options.query?.trim().toLowerCase()
  if (query) data = data.filter((listing) => `${listing.title} ${listing.description}`.toLowerCase().includes(query))
  if (options.categories?.length) data = data.filter((listing) => listing.categories.some((category) => options.categories?.includes(category)))
  if (options.countries?.length) data = data.filter((listing) => listing.countries.some((country) => options.countries?.includes(country)))
  if (options.author) data = data.filter((listing) => listing.author.id.toString() === options.author)
  if (options.priceMin) data = data.filter((listing) => listing.priceInCents >= options.priceMin!)
  if (Number.isFinite(options.priceMax)) data = data.filter((listing) => listing.priceInCents <= options.priceMax!)
  if (options.sort === 'price-asc') data.sort((a, b) => a.priceInCents - b.priceInCents)
  else if (options.sort === 'price-desc') data.sort((a, b) => b.priceInCents - a.priceInCents)
  else data.sort((a, b) => Date.parse(b.listedAt) - Date.parse(a.listedAt))
  const total = data.length
  const skip = options.skip ?? 0
  const limit = options.limit ?? 20
  return { data: data.slice(skip, skip + limit), meta: { total, skip, limit } }
}
