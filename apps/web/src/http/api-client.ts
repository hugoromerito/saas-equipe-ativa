import ky from 'ky'
import { getCookie } from 'cookies-next'
import { env } from '@saas/env'

export const api = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        if (typeof window === 'undefined') {
          const { cookies } = await import('next/headers')

          const serverCookies = cookies()
          const token = (await serverCookies).get('token')?.value

          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`)
          } else {
            const token = getCookie('token')

            if (token) {
              request.headers.set('Authorization', `Bearer ${token}`)
            }
          }
        }
      },
    ],
  },
})
