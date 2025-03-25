import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'

export async function getApplicant(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:organizationSlug/applicant/:applicantSlug',
      {
        schema: {
          tags: ['applicants'],
          summary: 'Get applicant.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            organizationSlug: z.string(),
            applicantSlug: z.string(),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              name: z.string(),
              birthdate: z.date(),
            }),
          },
        },
      },
      async (request) => {
        const { organizationSlug, applicantSlug } = request.params

        const organization = await prisma.organization.findUnique({
          where: { slug: organizationSlug },
          select: { id: true },
        })

        if (!organization) {
          throw new BadRequestError('Organização não encontrada.')
        }

        const applicant = await prisma.applicant.findFirst({
          where: {
            id: applicantSlug,
            organizationId: organization.id,
          },
          select: {
            id: true,
            name: true,
            birthdate: true,
          },
        })

        if (!applicant) {
          throw new BadRequestError('Solicitante não encontrado.')
        }

        return applicant // { name, birthdate }
      },
    )
}
