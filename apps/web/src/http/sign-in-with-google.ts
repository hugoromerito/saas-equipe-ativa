import { api } from './api-client'

interface signInWithGoogle {
  code: string
}

interface signInWithGoogleResponse {
  token: string
}

export async function signInWithGoogle({ code }: signInWithGoogle) {
  const result = await api
    .post('sessions/google', {
      json: {
        code,
      },
    })
    .json<signInWithGoogleResponse>()

  return result
}
