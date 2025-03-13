import { type FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { google } from 'googleapis'

import { prisma } from '@/lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'

const GOOGLE_CLIENT_ID =
  '383673663455-1a0gaafn9i7pot65qe7buo7n86dvnfob.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'
const GOOGLE_REDIRECT_URI = 'http://localhost:3000/api/auth/callback'

// Rota para obter a URL de autenticação com o escopo necessário
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

      // Gera a URL de autenticação com o escopo para acessar o e-mail do usuário
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
        ],
      })

      console.log(`Auth URL gerada: ${authUrl}`)

      return reply.status(200).send({ url: authUrl })
    },
  )
}

// Rota para autenticar utilizando o código recebido do Google
export async function authenticateWithGoogle(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/google',
    {
      schema: {
        tags: ['auth'],
        summary: 'Autenticar com Google OAuth',
        body: z.object({
          code: z.string(), // código de autorização recebido do frontend
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

      console.log(`Código de autorização recebido: ${code}`)

      // Configura o cliente OAuth2 com as credenciais do Google
      const oauth2Client = new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI,
      )

      let tokens
      try {
        // Troca o código recebido pelo token de acesso e o id_token
        const response = await oauth2Client.getToken(code)
        tokens = response.tokens
        console.log(`Tokens recebidos: ${JSON.stringify(tokens)}`)
      } catch (error: any) {
        console.log(`Erro ao obter tokens: ${error.message}`)
        throw new BadRequestError(
          'Falha na autenticação com o Google. Código inválido.',
        )
      }

      if (!tokens.id_token) {
        console.log('Token de ID ausente nos tokens recebidos.')
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
        console.log('id_token verificado com sucesso.')
      } catch (error: any) {
        console.log(`Erro na verificação do id_token: ${error.message}`)
        throw new BadRequestError(
          'Falha na autenticação com o Google. Não foi possível verificar o token.',
        )
      }

      const payload = ticket.getPayload()
      if (!payload || !payload.email) {
        console.log('Payload inválido ou e-mail não encontrado no token.')
        throw new BadRequestError(
          'Falha na autenticação com o Google. E-mail não encontrado no token.',
        )
      }

      console.log(`Payload do token: ${JSON.stringify(payload)}`)

      // Procura o usuário no banco de dados pelo e-mail fornecido pelo Google
      let user = await prisma.user.findUnique({
        where: { email: payload.email },
      })

      // Se o usuário não existir, cria um novo usuário com os dados retornados pelo Google
      if (!user) {
        console.log(
          `Usuário não encontrado. Criando novo usuário para ${payload.email}.`,
        )
        user = await prisma.user.create({
          data: {
            email: payload.email,
            name: payload.name || payload.email,
            avatarUrl: payload.picture,
            passwordHash: null, // Usuário não tem senha, pois utiliza autenticação social
          },
        })
      } else {
        console.log(`Usuário encontrado: ${payload.email}`)
      }

      // Gera um token JWT para o usuário
      const token = await reply.jwtSign(
        { sub: user.id },
        { sign: { expiresIn: '7d' } },
      )
      console.log(`JWT gerado para o usuário: ${user.id}`)

      // O Code deve ser decodificado antes de ser usado na rota
      return reply.status(201).send({ token })
    },
  )
}
