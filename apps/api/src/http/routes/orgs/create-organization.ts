import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'
import { createSlug } from '@/utils/create-slug'

export async function createOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Create a new organization',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
          }),
          response: {
            201: z.object({
              organizationId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const { name } = request.body

        // Gera o slug a partir do nome
        const slug = createSlug(name)

        // Verifica se já existe organização com o mesmo slug
        const organizationBySlug = await prisma.organization.findUnique({
          where: { slug },
        })

        if (organizationBySlug) {
          throw new BadRequestError(
            'Já existe outra organização com o mesmo nome.',
          )
        }

        const organization = await prisma.organization.create({
          data: {
            name,
            slug: createSlug(name),
            ownerId: userId,
            members: {
              create: {
                userId,
                role: 'ADMIN',
              },
            },
          },
        })

        return reply.status(201).send({
          organizationId: organization.id,
        })
      },
    )
}
