import type { DemandCategory, DemandPriority, DemandStatus } from '@saas/auth'
import { api } from './api-client'

interface GetDemandResponse {
  demand: {
    id: string
    title: string
    description: string
    status: DemandStatus
    priority: DemandPriority
    category: DemandCategory
    cep: string | null
    state: string | null
    city: string | null
    neighborhood: string | null
    street: string | null
    complement: string | null
    number: string | null
    owner: {
      id: string
      name: string | null
      email: string
      avatarUrl: string | null
    } | null
    unit: {
      id: string
      name: string
      slug: string
      organization: {
        id: string
        name: string
        slug: string
        avatarUrl: string | null
      }
    }
    applicant: {
      id: string
      name: string
      birthdate: Date
      avatarUrl: string | null
    }
    member: {
      user: {
        id: string
        name: string | null
        email: string
        avatarUrl: string | null
      }
    } | null
  }
}

interface GetDemandRequest {
  organizationSlug: string
  unitSlug: string
  demandSlug: string
}

export async function getDemand({
  organizationSlug,
  unitSlug,
  demandSlug,
}: GetDemandRequest): Promise<GetDemandResponse> {
  const result = await api
    .get(
      `organizations/${organizationSlug}/units/${unitSlug}/demands/${demandSlug}`,
    )
    .json<GetDemandResponse>()

  return result
}
