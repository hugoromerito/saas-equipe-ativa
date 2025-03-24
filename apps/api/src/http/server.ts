import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import { createAccount } from './routes/auth/create-account'
import { getProfile } from './routes/auth/get-profile'
import { errorHandler } from './error-handler'
import { requestPasswordRecover } from './routes/auth/request-password-recover'
import { resetPassword } from './routes/auth/reset-password'
import {
  authenticateWithGoogle,
  getGoogleAuthUrl,
} from './routes/auth/authenticate-with-google'
import { env } from '@saas/env'
import { createOrganization } from './routes/orgs/create-organization'
import { getMembership } from './routes/orgs/get-membership'
import { getOrganization } from './routes/orgs/get-organization'
import { getOrganizations } from './routes/orgs/get-organizations'
import { updateOrganization } from './routes/orgs/update-organization'
import { shutdownOrganization } from './routes/orgs/shutdown-organization'
import { transferOrganization } from './routes/orgs/transfer-organization'
import { createUnit } from './routes/units/create_unit'
import { createInvite } from './routes/invites/create-invite'
import { acceptInvite } from './routes/invites/accept-invite'
import { getUnits } from './routes/units/get-units'
import { createApplicant } from './routes/applicants/create-applicant'
import { createDemand } from './routes/demands/create-demand'
import { getDemands } from './routes/demands/get-demand'
import { updateDemand } from './routes/demands/update-demand'
import { getCheckApplicant } from './routes/applicants/get-check-applicant'
import { getApplicant } from './routes/applicants/get-applicant'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'API Equipe Ativa',
      description: 'Full-stack SaaS app with multi-tenant & RBAC.',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/documentation',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  exposedHeaders: ['Content-Type'],
  credentials: true,
})

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(authenticateWithGoogle)
app.register(getGoogleAuthUrl)
app.register(getProfile)
app.register(requestPasswordRecover)
app.register(resetPassword)

app.register(createOrganization)
app.register(getOrganizations)
app.register(getOrganization)
app.register(updateOrganization)
app.register(shutdownOrganization)
app.register(transferOrganization)
app.register(getMembership)

app.register(createUnit)
app.register(getUnits)

app.register(createInvite)
app.register(acceptInvite)

app.register(createApplicant)
app.register(getApplicant)
app.register(getCheckApplicant)

app.register(createDemand)
app.register(getDemands)
app.register(updateDemand)

app.listen({ port: env.PORT || 4000 }).then(() => {
  console.log('HTTP server running!')
})
