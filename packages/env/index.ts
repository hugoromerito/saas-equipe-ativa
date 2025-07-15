import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

// Log dos valores brutos lidos do process.env
console.log('Raw environment variables:', {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_OAUTH_CLIENT_REDIRECT_URI:
    process.env.GOOGLE_OAUTH_CLIENT_REDIRECT_URI,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
})

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(3333),
    DATABASE_URL: z
      .string()
      .url()
      .default(
        'postgresql://neondb_owner:npg_AdsO72nVgwvE@ep-late-tooth-a5985332-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require',
      ),
    JWT_SECRET: z.string().default('0195c561-fab8-76ef-8562-db6b22e2348e'),
    GOOGLE_OAUTH_CLIENT_ID: z
      .string()
      .default(
        '383673663455-1a0gaafn9i7pot65qe7buo7n86dvnfob.apps.googleusercontent.com',
      ),
    GOOGLE_OAUTH_CLIENT_SECRET: z
      .string()
      .default('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'),
    GOOGLE_OAUTH_CLIENT_REDIRECT_URI: z
      .string()
      .url()
      .default('https://dashboard.equipeativa.com/api/auth/callback'),
  },
  client: {},
  shared: {
    NEXT_PUBLIC_API_URL: z
      .string()
      .url()
      .default('https://api.equipeativa.com'),
  },
  runtimeEnv: {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    GOOGLE_OAUTH_CLIENT_REDIRECT_URI:
      process.env.GOOGLE_OAUTH_CLIENT_REDIRECT_URI,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  emptyStringAsUndefined: true,
})

// Log dos valores após a validação
console.log('Validated environment variables:', env)
