import type { ClientChat } from "@/types/chats"
import type { Api } from "@/hooks/useApi"
import { getDemoChat } from '@/data/mock/demo'

export async function queryChatById(
	api: Api,
	id: string,
): Promise<ClientChat & { sharedKey: CryptoKey }> {
	void api
	return getDemoChat(id)
}
