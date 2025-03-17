'use server'

import { google } from 'googleapis'
import { redirect } from 'next/navigation'

export async function signInWithGoogle() {
  const oauth2Client = new google.auth.OAuth2(
    '383673663455-1a0gaafn9i7pot65qe7buo7n86dvnfob.apps.googleusercontent.com',
    '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',
    'http://localhost:3000/api/auth/callback',
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
