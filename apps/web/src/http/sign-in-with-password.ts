import { api } from './api-client'

interface signInWithPasswordRequeste {
  email: string
  password: string
}

interface signInWithPasswordResponse {
  token: string
}

export async function signInWithPassword({
  email,
  password,
}: signInWithPasswordRequeste) {
  const result = await api
    .post('sessions/password', {
      json: {
        email,
        password,
      },
    })
    .json<signInWithPasswordResponse>()

  return result
}
