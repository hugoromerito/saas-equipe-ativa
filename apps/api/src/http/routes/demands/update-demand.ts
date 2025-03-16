import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'
import { DemandCategory, DemandPriority, DemandStatus } from '@prisma/client'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function updateDemand(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/organizations/:organizationSlug/units/:unitSlug/demands/:demandSlug',
      {
        schema: {
          tags: ['demands'],
          summary: 'Atualiza uma demanda para uma unidade',
          security: [{ bearerAuth: [] }],
          body: z.object({
            status: z.nativeEnum(DemandStatus),
          }),
          params: z.object({
            organizationSlug: z.string(),
            unitSlug: z.string(),
            demandSlug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { organizationSlug, unitSlug, demandSlug } = request.params
        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(unitSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', 'Demand')) {
          throw new UnauthorizedError(
            `You're not allowed to create new  invites.`,
          )
        }

        // Busca a organização pelo slug informado (renomeada para evitar conflito)
        const org = await prisma.organization.findUnique({
          where: { slug: organizationSlug },
        })
        if (!org) {
          throw new BadRequestError('Organização não encontrada')
        }

        // Busca a unidade que pertença à organização
        const unit = await prisma.unit.findFirst({
          where: {
            slug: unitSlug,
            organization: {
              slug: organizationSlug,
            },
          },
        })
        if (!unit) {
          throw new BadRequestError(
            'Unidade não encontrada ou não pertence à organização.',
          )
        }

        // Busca o usuário autenticado para obter o nome
        const user = await prisma.user.findUnique({
          where: { id: userId },
        })
        if (!user?.name) {
          throw new BadRequestError('Usuário não encontrado')
        }

        // Busca o Applicant com base no demandSlug
        const demandExists = await prisma.demand.findUnique({
          where: { id: demandSlug },
        })
        if (!demandExists) {
          throw new BadRequestError('Demanda não encontrada')
        }

        const { status } = request.body

        await prisma.demand.update({
          where: {
            id: demandSlug,
          },
          data: {
            status,
            updatedByMemberName: user.name,
          },
        })

        return reply.status(204).send()
      },
    )
}
