import crypto from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'
import Joi from 'joi'
import { MongoServerError } from 'mongodb'

import dbConnect from '@/data/api/mongo'
import User, { UserPublicKeyJWK } from '@/data/api/mongo/models/user'
import { sessionStore, sessionToCookie } from '@/data/api/session'
import { UserRole } from '@/types/auth'

type Data = {
  id: string
  username: string
  expiresAt: string
}

type Error = {
  code: string
  message?: string
}

const jwkSchema = Joi.object({
  kty: Joi.string().valid('EC').required(),
  crv: Joi.string().valid('P-521').required(),
  x: Joi.string().base64({ urlSafe: true, paddingRequired: false }).required(),
  y: Joi.string().base64({ urlSafe: true, paddingRequired: false }).required(),
  ext: Joi.boolean().valid(true).required(),
  key_ops: Joi.array().items(Joi.string().valid('deriveKey', 'deriveBits')).optional(),
  d: Joi.forbidden(),
})

const randomGuestUsername = () => `guest-${crypto.randomBytes(6).toString('hex')}`

async function createGuestUser(publicKey: UserPublicKeyJWK) {
  for (let i = 0; i < 10; i += 1) {
    const username = randomGuestUsername()
    try {
      const user = await User.createWithPasskey({
        username,
        passkey: crypto.randomBytes(32),
        roles: [UserRole.USER],
        publicKey,
      })
      return user
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        continue
      }
      throw error
    }
  }

  throw new Error('Failed to generate a unique guest username')
}

async function POST(req: NextApiRequest, res: NextApiResponse<Data | Error>) {
  const validation = Joi.object({
    publicKey: jwkSchema.required(),
  }).validate(req.body)

  if (validation.error) {
    res.status(400).json({ code: 'INVALID_REQUEST', message: validation.error.message })
    return
  }

  const body = validation.value as { publicKey: UserPublicKeyJWK }

  await dbConnect()

  let user: Awaited<ReturnType<typeof User.createWithPasskey>>
  try {
    user = await createGuestUser(body.publicKey)
  } catch (error) {
    console.error('Error creating guest user:', error)
    res.status(500).json({ code: 'INTERNAL_SERVER_ERROR' })
    return
  }

  const session = await sessionStore.createSession(user.id, [UserRole.USER])
  res.setHeader('Set-Cookie', sessionToCookie(session))
  res.status(200).json({
    id: user.id,
    username: user.username,
    expiresAt: session.expiresAt.toISOString(),
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>,
) {
  switch (req.method) {
    case 'POST':
      return await POST(req, res)
    default:
      res.status(405).end()
  }
}