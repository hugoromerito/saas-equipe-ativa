import { auth } from '@/http/middlewares/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { roleSchema } from '@saas/auth'
import { DemandCategory, DemandPriority, DemandStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function getDemands(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:organizationSlug/units/:unitSlug/demands',
      {
        schema: {
          tags: ['demands'],
          summary: 'Get demands on unit',
          security: [{ bearerAuth: [] }],
          params: z.object({
            organizationSlug: z.string(),
            unitSlug: z.string(),
          }),
          response: {
            200: z.object({
              demands: z.array(
                z.object({
                  id: z.string().uuid(),
                  title: z.string(),
                  description: z.string(),
                  status: z.nativeEnum(DemandStatus),
                  priority: z.nativeEnum(DemandPriority),
                  category: z.nativeEnum(DemandCategory),
                  street: z.string().nullable(),
                  complement: z.string().nullable(),
                  number: z.string().nullable(),
                  neighborhood: z.string().nullable(),
                  cep: z.string().nullable(),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const { organizationSlug, unitSlug } = request.params
        const userId = await request.getCurrentUserId()

        const { membership } = await request.getUserMembership(unitSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Demand')) {
          throw new UnauthorizedError(`You're not allowed to view demands.`)
        }

        const demands = await prisma.demand.findMany({
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            category: true,
            street: true,
            complement: true,
            number: true,
            neighborhood: true,
            cep: true,
          },
          where: {
            unit: {
              organization: {
                slug: organizationSlug,
              },
              slug: unitSlug,
            },
          },
        })

        return { demands }
      },
    )
}
