import { MarketListingSearchResult } from "@/types/market"
import type { Api } from "@/hooks/useApi"
import { demoListings } from '@/data/mock/demo'

export async function queryMarketListingById(
	api: Api,
	id: string,
): Promise<MarketListingSearchResult> {
	void api
	const listing = demoListings.find((item) => item.id.toString() === id)
	if (!listing) throw new Error('Demo listing not found')
	return listing
}
