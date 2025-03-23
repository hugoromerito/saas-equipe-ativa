import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'
import { isCPF } from 'validation-br'

export async function getCheckApplicant(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:organizationSlug/applicant',
      {
        schema: {
          tags: ['applicants'],
          summary: 'Get applicant by CPF within an organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            organizationSlug: z.string(),
          }),
          body: z.object({
            cpf: z.string(),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { organizationSlug } = request.params
        const { cpf } = request.body

        if (!isCPF(cpf)) {
          throw new BadRequestError('CPF inválido.')
        }

        // Busca a organização pelo slug
        const organization = await prisma.organization.findUnique({
          where: { slug: organizationSlug },
          select: { id: true },
        })

        if (!organization) {
          throw new BadRequestError('Organização não encontrada.')
        }

        const { membership } = await request.getUserMembership(organizationSlug)

        // Busca o applicant vinculado à organização e ao CPF
        const applicant = await prisma.applicant.findFirst({
          where: {
            cpf,
            organizationId: organization.id,
          },
        })

        if (!organization) {
          throw new BadRequestError('Organização não encontrada.')
        }

        if (!applicant) {
          throw new BadRequestError('CPF não cadastrado nesta organização.')
        }

        return reply.status(200).send({
          id: applicant.id,
        })
      },
    )
}
