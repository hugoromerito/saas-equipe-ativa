import { roleSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { BadRequestError } from '../_errors/bad-request-error'

export async function getMembersUnit(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:organizationSlug/units/:unitSlug/members',
      {
        schema: {
          tags: ['Members'],
          summary:
            'Get all members from a specific unit within the organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            organizationSlug: z.string(),
            unitSlug: z.string(),
          }),
          response: {
            200: z.object({
              members: z.array(
                z.object({
                  id: z.string().uuid(),
                  userId: z.string().uuid(),
                  role: roleSchema,
                  name: z.string().nullable(),
                  email: z.string().email(),
                  avatarUrl: z.string().url().nullable(),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { organizationSlug, unitSlug } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(organizationSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        // if (cannot('get', 'User')) {
        //   throw new UnauthorizedError(
        //     'Você não possui autorização para visualizar os membros dessa unidade.',
        //   )
        // }

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

        const members = await prisma.member.findMany({
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          where: {
            organizationId: organization.id,
            unitId: unit.id,
          },
          orderBy: {
            role: 'asc',
          },
        })

        const membersWithRoles = members.map(
          ({ user: { id: userId, ...user }, ...member }) => {
            return {
              ...user,
              ...member,
              userId,
            }
          },
        )

        return reply.send({ members: membersWithRoles })
      },
    )
}
