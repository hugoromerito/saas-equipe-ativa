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
      '/units',
      {
        schema: {
          tags: ['units'],
          summary: 'Get unit where user is a member',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              units: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  slug: z.string(),
                  description: z.string().nullable(),
                  location: z.string(),
                  role: roleSchema,
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId()

        const units = await prisma.unit.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            location: true,
            members: {
              select: {
                role: true,
              },
              where: {
                userId,
              },
            },
          },
          where: {
            members: {
              some: {
                userId,
              },
            },
          },
        })

        const unitsWithUserRole = units.map(({ members, ...unit }) => {
          return {
            ...unit,
            role: members[0].role,
          }
        })

        return { units: unitsWithUserRole }
      },
    )
}
