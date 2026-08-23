import { Api } from "@/hooks/useApi"
import type { ClientChat } from "@/types/chats"
import type { PaginatedResult } from "@/types/common"
import { getDemoChats } from '@/data/mock/demo'

export async function queryChats(
	api: Api,
): Promise<PaginatedResult<ClientChat & { sharedKey: CryptoKey }>> {
	void api
	return getDemoChats()
}
