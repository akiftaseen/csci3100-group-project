import type { SearchMarketListingsOptions } from '@/types/market'
import type { Api } from '@/hooks/useApi'
import { searchDemoListings } from '@/data/mock/demo'

export async function queryMarketListings(
  api: Api,
  options: SearchMarketListingsOptions = {},
) {
  void api
  return searchDemoListings(options)
}
