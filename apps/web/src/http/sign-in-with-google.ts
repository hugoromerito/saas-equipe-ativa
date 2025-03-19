import { api } from './api-client'

interface SignInWithGoogle {
  code: string
}

interface SignInWithGoogleResponse {
  token: string
}

export async function signInWithGoogle({ code }: SignInWithGoogle) {
  const result = await api
    .post('sessions/google', {
      json: {
        code,
      },
    })
    .json<SignInWithGoogleResponse>()

  return result
}
