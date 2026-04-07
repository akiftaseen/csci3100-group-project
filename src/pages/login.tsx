import Link from 'next/link'
import { useCallback, useState } from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router'

import { geistMono, geistSans } from '@/styles/fonts'
import SubmitButton from '@/components/form/SubmitButton'
import { PageWithLayout } from '@/types/layout'
import { ApiProvider, useApi } from '@/hooks/useApi'
import { exportKey, generateRandomKeyPair } from '@/utils/frontend/e2e'

const Login: PageWithLayout = () => {
  const router = useRouter()
  const api = useApi()

  const [generalError, setGeneralError] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)

  const handleOneClickLogin = useCallback(async () => {
    setGeneralError(undefined)
    setIsLoading(true)

    try {
      const uek = await generateRandomKeyPair()
      const publicKey = await exportKey(uek.publicKey)

      const response = await api.fetch('/auth/quick-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicKey }),
      })

      if (!response.ok) {
        throw new Error(`Quick login failed: ${response.status}`)
      }

      const body = (await response.json()) as {
        id: string
        username: string
        expiresAt: string
      }

      api.setUser({ id: body.id, username: body.username })
      api.setUek(uek)
      api.setTokenExpiresAt(new Date(body.expiresAt))
      await router.push('/dashboard')
    } catch (error) {
      console.error('One-click login error:', error)
      setGeneralError('Unable to log in right now. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [api, router])

  return (
    <div
      className={classNames(
        geistSans.variable,
        geistMono.variable,
        'grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-4 pb-10 gap-8 sm:p-8 md:p-20 md:pb-20 md:gap-16 font-body',
      )}
    >
      <main className='row-start-2 flex w-full max-w-md flex-col items-center gap-6 sm:gap-8'>
        <h1 className='border-b-2 border-foreground text-center font-mono text-4xl font-bold'>
          One-Click Login
        </h1>

        <div className='w-full space-y-4'>
          <p className='text-center text-sm text-foreground/70'>
            Continue instantly with a temporary account. No username or password required.
          </p>

          {generalError && (
            <p className='mx-auto max-w-96 text-center text-sm text-red-500'>
              {generalError}
            </p>
          )}

          <div className='pt-4'>
            <SubmitButton
              look='primary'
              type='button'
              className='w-full'
              loading={isLoading}
              onClick={handleOneClickLogin}
            >
              Continue in One Click
            </SubmitButton>
          </div>
        </div>

        <div className='pt-2 text-center'>
          <p>
            Prefer creating a permanent account?{' '}
            <Link href='/signup' className='link underline underline-offset-4'>
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

Login.getLayout = (page) => {
  return <ApiProvider>{page}</ApiProvider>
}

export default Login
