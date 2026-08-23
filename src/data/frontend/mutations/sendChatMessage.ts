import { PostChatMessagePayload } from "@/types/demo-actions"
import type { Api } from "@/hooks/useApi"
import { addDemoMessage } from '@/data/mock/demo'

export async function sendChatMessage(
	api: Api,
	chatId: string,
	message: PostChatMessagePayload,
	sharedKey: CryptoKey,
) {
	void sharedKey
	if (message.type === 'text') {
		addDemoMessage(chatId, api.user?.id ?? '', message.content)
	}
}
