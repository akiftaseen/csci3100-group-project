import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'

import { DEMO_USER } from '@/data/mock/demo'
import { useApi } from '@/hooks/useApi'
import { generateRandomKeyPair } from '@/utils/frontend/e2e'

export const useDefaultAccountLogin = () => {
  const api = useApi()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()

  const login = useCallback(async () => {
    setError(undefined)
    setIsLoading(true)

    try {
      const keyPair = api.uek ?? (await generateRandomKeyPair())

      api.setUser(DEMO_USER)
      api.setUek(keyPair)
      api.setTokenExpiresAt(undefined)

      await router.push('/dashboard/marketplace')
    } catch (loginError) {
      console.error('Default account login error:', loginError)
      setError('Unable to open the demo right now. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [api, router])

  return { login, isLoading, error }
}
