import type { Role } from '@saas/auth'
import { api } from './api-client'

interface GetMembersResponse {
  members: {
    userId: string
    id: string
    role: Role
    name: string | null
    avatarUrl: string | null
    email: string
  }[]
}

interface GetMembersRequest {
  organizationSlug: string
  unitSlug: string
}

export async function getMembers({
  organizationSlug,
  unitSlug,
}: GetMembersRequest): Promise<GetMembersResponse> {
  const result = await api
    .get(`organizations/${organizationSlug}/units/${unitSlug}/members`)
    .json<GetMembersResponse>()

  return result
}
