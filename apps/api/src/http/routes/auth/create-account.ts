import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

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
    async (request, reply) => {
      const {
        name,
        email,
        password,
        birthdate,
        ticket,
        cpf,
        mother,
        father,
        phone,
        observation,
      } = request.body

      const userWithSameEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (userWithSameEmail) {
        return reply
          .status(400)
          .send({ message: 'user with same e-mail already exists.' })
      }

      const passwordHash = await hash(password, 6)

      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          birthdate,
          ticket,
          cpf,
          mother,
          father,
          phone,
          observation,
        },
      })

      return reply.status(201).send({ message: 'User created' })
    },
  )
}
