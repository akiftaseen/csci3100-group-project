import type { ClientChatMessage } from "@/types/chats"
import type { PaginatedResult, PaginationOptions } from "@/types/common"
import type { Api } from "@/hooks/useApi"
import { getDemoMessages } from '@/data/mock/demo'

export async function queryChatMessages(
	api: Api,
	chatId: string,
	sharedKey: CryptoKey,
	options?: Partial<PaginationOptions>,
): Promise<PaginatedResult<ClientChatMessage>> {
	void api
	void sharedKey
	void options
	return getDemoMessages(chatId)
}
