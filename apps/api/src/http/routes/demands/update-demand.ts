import { auth } from '@/http/middlewares/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { DemandStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { BadRequestError } from '../_errors/bad-request-error'

export async function updateDemand(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/organizations/:organizationSlug/units/:unitSlug/demands/:demandSlug',
      {
        schema: {
          tags: ['demands'],
          summary: 'Update demand status and member',
          security: [{ bearerAuth: [] }],
          params: z.object({
            organizationSlug: z.string(),
            unitSlug: z.string(),
            demandSlug: z.string(),
          }),
          body: z.object({
            status: z.nativeEnum(DemandStatus),
          }),
          response: {
            204: z.null(),
          },
        },
        async handler(request, reply) {
          const { organizationSlug, unitSlug, demandSlug } = request.params
          const userId = await request.getCurrentUserId()
          const { status } = request.body
          const { membership } = await request.getUserMembership(
            organizationSlug,
            unitSlug,
          )

          const { cannot } = getUserPermissions(userId, membership.role)

          if (cannot('update', 'Demand')) {
            throw new UnauthorizedError(
              'Você não possui permissão para atualizar esta demanda.',
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

          const member = await prisma.member.findFirst({
            where: {
              userId,
              unitId: unit.id,
              organizationId: unit.organizationId,
            },
            include: {
              user: true,
            },
          })

          if (!member) {
            throw new BadRequestError('Membro da unidade não encontrado.')
          }

          await prisma.demand.update({
            where: {
              id: demandSlug,
            },
            data: {
              status,
              memberId: member.id,
              updatedByMemberName: member.user.name ?? null,
            },
          })

          return reply.status(204).send()
        },
      },
    )
}
