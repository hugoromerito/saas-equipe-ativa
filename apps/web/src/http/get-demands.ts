import type { DemandCategory, DemandPriority, DemandStatus } from '@saas/auth'
import { api } from './api-client'

interface GetDemandsResponse {
  demands: {
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
  }[]
}

interface GetDemandsRequest {
  organizationSlug: string
  unitSlug: string
}

export async function getDemands({
  organizationSlug,
  unitSlug,
}: GetDemandsRequest): Promise<GetDemandsResponse> {
  const result = await api
    .get(`organizations/${organizationSlug}/units/${unitSlug}/demands`)
    .json<GetDemandsResponse>()

  return result
}
