export interface MarketListingSearchResult {
  id: string
  title: string
  description: string
  pictures: string[]
  author: {
    id: string
    username?: string
    publicKey: JsonWebKey
  }
  listedAt: string
  editedAt?: string
  priceInCents: number
  countries: string[]
  categories: string[]
}

export interface SearchMarketListingsOptions {
  query?: string
  categories?: string[]
  countries?: string[]
  priceMin?: number
  priceMax?: number
  author?: string
  sort?: string
  skip?: number
  limit?: number
}
