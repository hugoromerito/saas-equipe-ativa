import type { Role } from '@saas/auth'
import { api } from './api-client'

interface GetPendingInvitesResponse {
  invites: {
    id: string
    createdAt: string
    role: Role
    email: string
    unit: {
      name: string
      organization: {
        name: string
      }
    } | null
    author: {
      name: string | null
      id: string
      avatarUrl: string | null
    } | null
  }[]
}

export async function getPendingInvites(): Promise<GetPendingInvitesResponse> {
  const result = await api
    .get(`pending-invites`)
    .json<GetPendingInvitesResponse>()

  return result
}
