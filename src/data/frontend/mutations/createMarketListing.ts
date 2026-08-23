import type { Api } from '@/hooks/useApi'
import type { PostMarketListingPayload } from '@/types/demo-actions'
import { demoListings } from '@/data/mock/demo'

export async function createMarketListing(
  api: Api,
  listing: PostMarketListingPayload,
) {
  void api
  void listing
  return { id: demoListings[0].id }
}
