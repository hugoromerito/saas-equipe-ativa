import { type FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { google } from 'googleapis'

import { prisma } from '@/lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'

// Em produção, essas constantes devem ser armazenadas em variáveis de ambiente.
const GOOGLE_CLIENT_ID =
  '383673663455-1a0gaafn9i7pot65qe7buo7n86dvnfob.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'
const GOOGLE_REDIRECT_URI = 'http://localhost:3000/api/auth/callback'

/**
 * Rota para obter a URL de autenticação com o Google.
 */
export async function getGoogleAuthUrl(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/auth/google/url',
    {
      schema: {
        tags: ['auth'],
        summary: 'Obter URL de autenticação do Google',
        response: {
          200: z.object({
            url: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const oauth2Client = new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI,
      )

      // Gera a URL com os escopos necessários para acessar email e perfil do usuário
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
        ],
      })

      return reply.status(200).send({ url: authUrl })
    },
  )
}

/**
 * Rota para autenticar com o Google OAuth.
 * Mescla a validação com Zod e a criação da conta, similar ao fluxo do GitHub.
 */
export async function authenticateWithGoogle(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/google',
    {
      schema: {
        tags: ['auth'],
        summary: 'Autenticar com Google OAuth',
        body: z.object({
          code: z.string(), // Código de autorização recebido do frontend
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      // Configura o cliente OAuth2 com as credenciais do Google
      const oauth2Client = new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI,
      )

      let tokens
      try {
        // Troca o código pelo token de acesso e o id_token
        const response = await oauth2Client.getToken(code)
        tokens = response.tokens
      } catch (error: any) {
        throw new BadRequestError(
          'Falha na autenticação com o Google. Código inválido.',
        )
      }

      if (!tokens.id_token) {
        throw new BadRequestError(
          'Falha na autenticação com o Google. Token de ID ausente.',
        )
      }

      let ticket
      try {
        // Verifica o id_token e extrai as informações do usuário
        ticket = await oauth2Client.verifyIdToken({
          idToken: tokens.id_token,
          audience: GOOGLE_CLIENT_ID,
        })
      } catch (error: any) {
        throw new BadRequestError(
          'Falha na autenticação com o Google. Não foi possível verificar o token.',
        )
      }

      const payload = ticket.getPayload()
      // Utiliza o Zod para validar e transformar o payload
      const googlePayloadSchema = z.object({
        sub: z.string(),
        email: z.string().email(),
        name: z.string().nullable().optional(),
        picture: z.string().url().nullable().optional(),
      })
      const googlePayload = googlePayloadSchema.parse(payload)

      // Procura o usuário no banco de dados pelo email fornecido pelo Google
      let user = await prisma.user.findUnique({
        where: { email: googlePayload.email },
      })

      // Caso o usuário não exista, cria um novo registro
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: googlePayload.email,
            name: googlePayload.name || googlePayload.email,
            avatarUrl: googlePayload.picture,
            passwordHash: null, // Usuário sem senha, pois utiliza autenticação social
          },
        })
      }

      // Verifica se já existe um registro de conta para o Google
      let account = await prisma.account.findUnique({
        where: {
          provider_userId: {
            provider: 'GOOGLE',
            userId: user.id,
          },
        },
      })

      // Caso não exista, cria o registro da conta
      if (!account) {
        account = await prisma.account.create({
          data: {
            provider: 'GOOGLE',
            providerAccountId: googlePayload.sub,
            userId: user.id,
          },
        })
      }

      // Gera o token JWT para o usuário autenticado
      const token = await reply.jwtSign(
        { sub: user.id },
        { sign: { expiresIn: '7d' } },
      )

      return reply.status(201).send({ token })
    },
  )
}
