import type { Api } from '@/hooks/useApi'
import { getDemoChats } from '@/data/mock/demo'

export async function createNewChatByUsername(
  api: Api,
  recipientUsername: string,
) {
  void api
  void recipientUsername
  const chats = await getDemoChats()
  return { id: chats.data[0].id, alreadyExists: true }
}
