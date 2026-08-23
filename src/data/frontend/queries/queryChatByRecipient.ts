import { Api } from "@/hooks/useApi"
import type { ClientChat } from "@/types/chats"
import { getDemoChatByRecipient } from '@/data/mock/demo'

export async function queryChatByRecipient(
	api: Api,
	recipientId: string,
): Promise<ClientChat & { sharedKey: CryptoKey }> {
	void api
	return getDemoChatByRecipient(recipientId)
}
