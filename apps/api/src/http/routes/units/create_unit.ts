import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'
import { createSlug } from '@/utils/create-slug'

export async function createUnit(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:organizationSlug/units',
      {
        schema: {
          tags: ['units'],
          summary: 'Cria uma nova unidade para uma organização',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            description: z.string().nullable(),
            location: z.string(),
          }),
          params: z.object({
            organizationSlug: z.string(),
          }),
          response: {
            201: z.object({
              unitId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { organizationSlug } = request.params
        const { organization } =
          await request.getUserMembership(organizationSlug)
        const { name, description, location } = request.body

        // Busca a organização pelo slug informado
        // const organization = await prisma.organization.findUnique({
        //   where: { slug: organizationSlug },
        // })

        if (!organization) {
          throw new BadRequestError('Organização não encontrada')
        }

        const unit = await prisma.unit.create({
          data: {
            name,
            slug: createSlug(name),
            description,
            location,
            organizationId: organization.id,
            ownerId: userId,
          },
        })

        return reply.status(201).send({
          unitId: unit.id,
        })
      },
    )
}
