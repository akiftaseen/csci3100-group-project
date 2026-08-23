import Link from 'next/link'
import classNames from 'classnames'

import { geistMono, geistSans } from '@/styles/fonts'
import SubmitButton from '@/components/form/SubmitButton'
import { PageWithLayout } from '@/types/layout'
import { ApiProvider } from '@/hooks/useApi'
import { useDefaultAccountLogin } from '@/hooks/useDefaultAccountLogin'

const Login: PageWithLayout = () => {
  const { login, isLoading, error } = useDefaultAccountLogin()

  return (
    <div
      className={classNames(
        geistSans.variable,
        geistMono.variable,
        'grid min-h-screen grid-rows-[auto_1fr_auto] items-center justify-items-center gap-8 p-4 pb-10 font-body sm:p-8 md:gap-16 md:p-20 md:pb-20',
      )}
    >
      <main className='row-start-2 flex w-full max-w-md flex-col items-center gap-6 sm:gap-8'>
        <h1 className='border-b-2 border-foreground text-center font-mono text-4xl font-bold'>
          One-Click Login
        </h1>

        <div className='w-full space-y-4'>
          <p className='text-center text-sm text-foreground/70'>
            Continue with the default jade.explorer account. No username,
            password, or account creation required.
          </p>

          {error && (
            <p className='mx-auto max-w-96 text-center text-sm text-red-500'>
              {error}
            </p>
          )}

          <div className='pt-4'>
            <SubmitButton
              look='primary'
              type='button'
              className='w-full'
              loading={isLoading}
              onClick={login}
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
