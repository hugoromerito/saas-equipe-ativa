import ky from 'ky'
import { getCookie } from 'cookies-next'

export const api = ky.create({
  prefixUrl: 'http://localhost:3333',
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
