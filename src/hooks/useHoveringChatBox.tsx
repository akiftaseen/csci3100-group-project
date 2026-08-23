import { MarketListingSearchResult } from '@/types/market'
import { Api } from '@/hooks/useApi'
import { getDemoSharedKey } from '@/data/mock/demo'
import dynamic from 'next/dynamic'
import React, { useCallback, useContext, useState } from 'react'
const HoveringChatBox = dynamic(() => import('@/components/HoveringChatBox'), {
  ssr: false,
})

interface HoveringChatBoxProviderState {
  isShowing: boolean
  show: (listing: MarketListingSearchResult) => void
  hide: () => void
  setSharedKey: (key: CryptoKey | null) => void
}

export const HoveringChatBoxContext =
  React.createContext<HoveringChatBoxProviderState>({
    isShowing: false,
    show: () => {},
    hide: () => {},
    setSharedKey: () => {},
  })

export const HoveringChatBoxProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [listing, setListing] = useState<
    MarketListingSearchResult | undefined
  >()
  const [sharedKey, setSharedKey] = useState<CryptoKey | null>(null)

  const isShowing = !!listing

  const show = setListing
  const hide = useCallback(() => {
    setListing(undefined)
  }, [])

  return (
    <HoveringChatBoxContext.Provider
      value={{ isShowing, hide, show, setSharedKey }}
    >
      {children}

      {listing && sharedKey && (
        <HoveringChatBox
          otherParty={{
            ...listing.author,
            username: listing.author.username ?? listing.author.id.toString(),
            id: listing.author.id.toString(),
          }}
          sharedKey={sharedKey}
          onClose={hide}
          initialPreviewMarketListing={listing}
        />
      )}
    </HoveringChatBoxContext.Provider>
  )
}

export const useHoveringChatBox = ({ api }: { api: Api }) => {
  void api
  const context = useContext(HoveringChatBoxContext)
  if (!context) {
    throw new Error(
      'useHoveringChatBox must be used within a HoveringChatBoxProvider',
    )
  }

  const show = useCallback(
    async (listing: MarketListingSearchResult) => {
      context.show(listing)
      context.setSharedKey(await getDemoSharedKey())
    },
    [context],
  )

  return {
    show,
    hide: context.hide,
    isShowing: context.isShowing,
  }
}
