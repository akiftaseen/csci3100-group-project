import { ChatMessageType } from '@/types/chats'

export interface PostMarketListingPayload {
  title: string
  description: string
  pictures: File[]
  priceInCents: number
  countries: string[]
  categories?: string[]
}

export interface PatchMarketListingPayload {
  title?: string
  description?: string
  pictures?: (File | number)[]
  priceInCents?: number
  countries?: string[]
  categories?: string[]
}

export type PostChatMessagePayload =
  | { type: ChatMessageType.Text; content: string }
  | {
      type: ChatMessageType.Attachment
      content: ArrayBuffer
      contentFilename?: string
    }
  | { type: ChatMessageType.MarketListing; content: string }
