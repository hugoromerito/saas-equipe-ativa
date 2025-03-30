import { auth } from '@/http/middlewares/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { DemandCategory, DemandPriority, DemandStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { BadRequestError } from '../_errors/bad-request-error'

export async function getDemand(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:organizationSlug/units/:unitSlug/demands/:demandSlug',
      {
        schema: {
          tags: ['demands'],
          summary: 'Get demand on unit',
          security: [{ bearerAuth: [] }],
          params: z.object({
            organizationSlug: z.string(),
            unitSlug: z.string(),
            demandSlug: z.string(),
          }),
          response: {
            200: z.object({
              demand: z.object({
                id: z.string().uuid(),
                title: z.string(),
                description: z.string(),
                status: z.nativeEnum(DemandStatus),
                priority: z.nativeEnum(DemandPriority),
                category: z.nativeEnum(DemandCategory),
                cep: z.string().nullable(),
                state: z.string().nullable(),
                city: z.string().nullable(),
                street: z.string().nullable(),
                neighborhood: z.string().nullable(),
                complement: z.string().nullable(),
                number: z.string().nullable(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { organizationSlug, unitSlug, demandSlug } = request.params
        const userId = await request.getCurrentUserId()

        const { membership } = await request.getUserMembership(organizationSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Demand')) {
          throw new UnauthorizedError(
            `Você não possui permissão para visualizar as demandas.`,
          )
        }

        const unit = await prisma.unit.findFirst({
          where: {
            slug: unitSlug,
            organization: {
              slug: organizationSlug,
            },
          },
        })

        if (!unit) {
          throw new BadRequestError('Unidade não encontrada na organização.')
        }

        const demand = await prisma.demand.findFirst({
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            category: true,
            cep: true,
            state: true,
            city: true,
            street: true,
            neighborhood: true,
            complement: true,
            number: true,
          },
          where: {
            id: demandSlug,
          },
        })

        if (!demand) {
          throw new BadRequestError('Demanda não encontrada.')
        }

        return { demand }
      },
    )
}
