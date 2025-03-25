import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function updateAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/update-user',
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          birthdate: z.date(),
          ticket: z.string().max(12),
          cpf: z.string().min(11).max(11),
          mother: z.string().nullable(),
          father: z.string().nullable(),
          phone: z.string(),
          zone: z.string().nullable(),
          section: z.string().nullable(),
          ticketOrigin: z.string().nullable(),
          ticketSituation: z.string().nullable(),
          ticketEmission: z.string().nullable(),
          observation: z.string().nullable(),
          travelStatus: z.string().nullable(),
          guideId: z.string().uuid(),
        }),
      },
    },
    () => {
      return 'Usuário atualizado!'
    },
  )
}
