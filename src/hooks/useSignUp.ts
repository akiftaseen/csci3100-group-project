import { useMutation } from '@tanstack/react-query'

import type { Api } from '@/hooks/useApi'
import { DEMO_USER } from '@/data/mock/demo'
import { generateRandomKeyPair } from '@/utils/frontend/e2e'

export interface UseSignUpOptions {
  api: Api
  throwOnError?: boolean | ((error: Error) => boolean)
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export enum SignUpErrorType {
  UsernameTaken = 'USERNAME_TAKEN',
  UnexpectedError = 'UNEXPECTED_ERROR',
}

export class SignUpError extends Error {
  constructor(public type: SignUpErrorType) {
    super(type)
    this.name = 'SignUpError'
  }
}

export const useSignUp = ({
  api,
  throwOnError = false,
  onSuccess,
  onError,
}: UseSignUpOptions) => {
  const mutation = useMutation({
    mutationFn: async (data: {
      username: string
      password: string
      licenseKey: string
    }) => {
      void data
      api.setUser(DEMO_USER)
      api.setUek(await generateRandomKeyPair())
    },
    throwOnError,
    onSuccess,
    onError,
  })

  return {
    signUp: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  }
}
