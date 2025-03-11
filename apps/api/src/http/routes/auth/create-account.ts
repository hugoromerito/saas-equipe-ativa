import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(8),
          birthdate: z.string(),
          ticket: z.string().max(12),
          cpf: z.string().min(11).max(11),
          mother: z.string().nullable(),
          father: z.string().nullable(),
          phone: z.string(),
          observation: z.string().nullable(),
        }),
      },
    },
    () => {
      return 'User created!'
    },
  )
}
