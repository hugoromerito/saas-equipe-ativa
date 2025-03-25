import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'
import { DemandCategory, DemandPriority } from '@prisma/client'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function createDemand(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:organizationSlug/units/:unitSlug/applicants/:applicantSlug/demands',
      {
        schema: {
          tags: ['demands'],
          summary: 'Cria uma nova demanda para uma unidade',
          security: [{ bearerAuth: [] }],
          body: z.object({
            title: z.string(),
            description: z.string(),
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
          params: z.object({
            organizationSlug: z.string(),
            unitSlug: z.string(),
            applicantSlug: z.string(),
          }),
          response: {
            201: z.object({
              demandId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { organizationSlug, unitSlug, applicantSlug } = request.params
        const userId = await request.getCurrentUserId()
        const { membership } = await request.getUserMembership(
          organizationSlug,
          unitSlug,
        )

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Demand')) {
          throw new UnauthorizedError(
            `Você não possui permissão para registrar demandas.`,
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

        // Busca o Applicant com base no applicantSlug
        const applicant = await prisma.applicant.findUnique({
          where: { id: applicantSlug },
        })
        if (!applicant) {
          throw new BadRequestError('Solicitante não encontrado')
        }

        // Busca o usuário autenticado para obter o nome
        const user = await prisma.user.findUnique({
          where: { id: userId },
        })
        if (!user?.name) {
          throw new BadRequestError('Usuário não encontrado')
        }

        const {
          title,
          description,
          priority,
          category,
          cep,
          state,
          city,
          street,
          neighborhood,
          complement,
          number,
        } = request.body

        const demand = await prisma.demand.create({
          data: {
            title,
            description,
            priority,
            category,
            cep,
            state,
            city,
            street,
            neighborhood,
            complement,
            number,
            unitId: unit.id,
            applicantId: applicant.id,
            ownerId: userId,
            createdByMemberName: user.name,
          },
        })

        return reply.status(201).send({
          demandId: demand.id,
        })
      },
    )
}
