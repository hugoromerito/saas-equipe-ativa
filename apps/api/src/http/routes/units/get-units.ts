import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { roleSchema } from '@saas/auth'

export async function getUnits(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:organizationsSlug/units',
      {
        schema: {
          tags: ['units'],
          summary: 'Get units where user is owner or member',
          security: [{ bearerAuth: [] }],
          params: z.object({
            organizationsSlug: z.string(),
          }),
          response: {
            200: z.object({
              units: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  slug: z.string(),
                  description: z.string().nullable(),
                  location: z.string(),
                  // role: roleSchema,
                  isOwner: z.boolean(), // 👈 flag extra
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId()
        const { organizationsSlug } = request.params

        const organization = await prisma.organization.findUnique({
          where: { slug: organizationsSlug },
          select: { id: true },
        })

        if (!organization) return { units: [] }

        // Buscar unidades que o usuário é dono OU membro
        const units = await prisma.unit.findMany({
          where: {
            organizationId: organization.id,
            OR: [{ ownerId: userId }, { members: { some: { userId } } }],
          },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            location: true,
            ownerId: true,
            members: {
              where: { userId },
              select: { role: true },
            },
          },
        })

        const unitsWithUserRole = units.map(({ ownerId, members, ...unit }) => {
          const isOwner = ownerId === userId
          // const role = members[0]?.role

          return {
            ...unit,
            // role,
            isOwner,
          }
        })

        return { units: unitsWithUserRole }
      },
    )
}
