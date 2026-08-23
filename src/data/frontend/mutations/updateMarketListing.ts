import type { Api } from '@/hooks/useApi'
import type { PatchMarketListingPayload } from '@/types/demo-actions'

export async function updateMarketListing(
  api: Api,
  listingId: string,
  changes: PatchMarketListingPayload,
) {
  void api
  void changes
  return { id: listingId }
}
