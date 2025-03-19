'use server'

import { google } from 'googleapis'
import { redirect } from 'next/navigation'
import { env } from '@saas/env'

export async function signInWithGoogle() {
  const oauth2Client = new google.auth.OAuth2(
    env.GOOGLE_OAUTH_CLIENT_ID,
    env.GOOGLE_OAUTH_CLIENT_SECRET,
    env.GOOGLE_OAUTH_CLIENT_REDIRECT_URI,
  )

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  })

  redirect(authUrl)
}
