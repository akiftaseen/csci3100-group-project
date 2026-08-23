import type { Api } from '@/hooks/useApi'
import { getDemoChatByRecipient } from '@/data/mock/demo'

export async function createNewChatByUserId(api: Api, recipientId: string) {
  void api
  const chat = await getDemoChatByRecipient(recipientId)
  return { id: chat.id, alreadyExists: true }
}
