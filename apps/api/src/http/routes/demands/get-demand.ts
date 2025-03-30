import { auth } from '@/http/middlewares/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import {
  DemandCategory,
  DemandPriority,
  DemandStatus,
  Role,
} from '@prisma/client'
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
                createdAt: z.date(),
                updatedAt: z.date().nullable(),

                owner: z
                  .object({
                    id: z.string().uuid(),
                    name: z.string().nullable(),
                    email: z.string().email(),
                    avatarUrl: z.string().url().nullable(),
                  })
                  .nullable(),

                unit: z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  slug: z.string(),
                  organization: z.object({
                    id: z.string().uuid(),
                    name: z.string(),
                    slug: z.string(),
                    avatarUrl: z.string().url().nullable(),
                  }),
                }),

                applicant: z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  birthdate: z.date(),
                  avatarUrl: z.string().url().nullable(),
                }),

                member: z
                  .object({
                    user: z.object({
                      id: z.string().uuid(),
                      name: z.string().nullable(),
                      email: z.string().email(),
                      avatarUrl: z.string().url().nullable(),
                    }),
                  })
                  .nullable(),
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
          where: {
            id: demandSlug,
            unit: {
              slug: unitSlug,
              organization: {
                slug: organizationSlug,
              },
            },
          },
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
            unit: {
              select: {
                id: true,
                name: true,
                slug: true,
                organization: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    avatarUrl: true,
                  },
                },
              },
            },
            applicant: {
              select: {
                id: true,
                name: true,
                birthdate: true,
                avatarUrl: true,
              },
            },
            member: {
              select: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        })

        if (!demand) {
          throw new BadRequestError('Demanda não encontrada.')
        }

        return { demand }
      },
    )
}
