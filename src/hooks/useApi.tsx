import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { DEMO_USER } from '@/data/mock/demo'
import { generateRandomKeyPair } from '@/utils/frontend/e2e'

export interface ApiState {
  isInitialized: boolean
  user?: { id: string; username: string }
  setUser: (user: ApiState['user']) => void
  tokenExpiresAt?: Date
  setTokenExpiresAt: (tokenExpiresAt?: Date) => void
  uek?: CryptoKeyPair
  setUek: (keyPair?: CryptoKeyPair) => void
}

const ApiContext = React.createContext<ApiState>({
  isInitialized: false,
  setUser: () => {},
  setTokenExpiresAt: () => {},
  setUek: () => {},
})

export const queryClient = new QueryClient()

export const ApiProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<ApiState['user']>(DEMO_USER)
  const [tokenExpiresAt, setTokenExpiresAt] = useState<Date>()
  const [uek, setUek] = useState<CryptoKeyPair>()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    generateRandomKeyPair()
      .then(setUek)
      .finally(() => setIsInitialized(true))
  }, [])

  const value = useMemo(
    () => ({
      isInitialized,
      user,
      setUser,
      tokenExpiresAt,
      setTokenExpiresAt,
      uek,
      setUek,
    }),
    [isInitialized, tokenExpiresAt, uek, user],
  )

  return (
    <ApiContext.Provider value={value}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ApiContext.Provider>
  )
}

export interface Api extends ApiState {
  isDemo: true
  fetch: (url: string, options?: RequestInit) => Promise<Response>
}

export const useApi = (): Api => {
  const context = React.useContext(ApiContext)

  const demoFetch = useCallback(async (url: string, options?: RequestInit) => {
    void url
    void options
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }, [])

  return useMemo(
    () => ({ ...context, isDemo: true as const, fetch: demoFetch }),
    [context, demoFetch],
  )
}
