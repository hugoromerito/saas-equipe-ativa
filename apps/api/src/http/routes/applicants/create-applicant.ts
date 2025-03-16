import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { checkerCpf } from '@/utils/checker-cpf'
import { isCPF, isTituloEleitor } from 'validation-br'

export async function createApplicant(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:organizationSlug/applicants',
      {
        schema: {
          tags: ['applicants'],
          summary: 'Cria uma nova demanda para uma unidade',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            birthdate: z.string(),
            cpf: z.string(),
            phone: z.string(),
            mother: z.string().nullable(),
            father: z.string().nullable(),
            ticket: z.string().nullable(),
            observation: z.string().nullable(),
          }),
          params: z.object({
            organizationSlug: z.string(),
          }),
          response: {
            201: z.object({
              applicantId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { organizationSlug } = request.params
        const { organization, membership } =
          await request.getUserMembership(organizationSlug)
        const {
          name,
          birthdate,
          cpf,
          phone,
          mother,
          father,
          ticket,
          observation,
        } = request.body

        // Busca a organização pelo slug informado
        // const organization = await prisma.organization.findUnique({
        //   where: { slug: organizationSlug },
        // })

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Applicant')) {
          throw new UnauthorizedError(
            `You're not allowed to create new  applicant.`,
          )
        }

        if (!organization) {
          throw new BadRequestError('Organização não encontrada')
        }

        // Verifica se já existe um applicant com o mesmo CPF
        const existingCpf = await prisma.applicant.findUnique({
          where: { cpf },
        })

        if (!isCPF(cpf)) {
          throw new BadRequestError('CPF inválido')
        }
        if (existingCpf) {
          throw new BadRequestError('CPF já cadastrado')
        }

        // Se o ticket for informado, valida e verifica sua unicidade
        if (ticket) {
          if (!isTituloEleitor(ticket)) {
            throw new BadRequestError('Ticket inválido')
          }

          const existingTicket = await prisma.applicant.findUnique({
            where: { ticket },
          })

          if (existingTicket) {
            throw new BadRequestError('Ticket já cadastrado')
          }
        }

        const applicant = await prisma.applicant.create({
          data: {
            name,
            birthdate,
            cpf,
            phone,
            mother,
            father,
            ticket,
            observation,
            organizationId: organization.id,
          },
        })

        return reply.status(201).send({
          applicantId: applicant.id,
        })
      },
    )
}
