import { getApplicant } from '@/http/get-applicant'
import { getMembership } from '@/http/get-membership'
import { getProfile } from '@/http/get-profile'
import { getUnits } from '@/http/get-units'
import { defineAbilityFor } from '@saas/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function isAuthenticated() {
  return !!(await cookies()).get('token')?.value
}

export async function getCurrentOrg() {
  return (await cookies()).get('org')?.value ?? null
}

export async function getCurrentApplicantId() {
  return (await cookies()).get('applicant')?.value ?? null
}

export async function getCurrentUnits() {
  const org = await getCurrentOrg()

  if (!org) {
    return null
  }

  const { units } = await getUnits(org)

  return units
}

export async function getCurrentApplicant() {
  const organizationSlug = await getCurrentOrg()
  const applicantSlug = await getCurrentApplicantId()

  if (!organizationSlug || !applicantSlug) {
    return null
  }

  const applicant = await getApplicant({ organizationSlug, applicantSlug })

  return applicant
}

export async function getCurrentUnit() {
  return (await cookies()).get('unit')?.value ?? null
}

export async function getCurrentMembership() {
  const org = await getCurrentOrg()

  if (!org) {
    return null
  }

  const { membership } = await getMembership(org)

  return membership
}

export async function ability() {
  const membership = await getCurrentMembership()

  if (!membership) {
    return null
  }

  const ability = defineAbilityFor({
    id: membership.userId,
    role: membership.role,
  })

  return ability
}

export async function auth() {
  const token = (await cookies()).get('token')?.value

  if (!token) {
    redirect('/auth/sign-in')
  }

  try {
    const { user } = await getProfile()

    return { user }
  } catch (err) {
    console.log(err)
  }

  redirect('/api/auth/sign-out')
}
