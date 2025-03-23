import type { DemandCategory, DemandPriority, DemandStatus } from '@saas/auth'
import { api } from './api-client'

interface CreateDemandRequest {
  organizationSlug: String
  unitSlug: String
  applicantSlug: String
  title: String
  description: String
  priority: DemandPriority
  category: DemandCategory
  street: String | null
  complement: String | null
  number: String | null
  neighborhood: String | null
  cep: String | null
}

type CreateDemandResponse = void

export async function createDemand({
  organizationSlug,
  unitSlug,
  applicantSlug,
  title,
  description,
  priority,
  category,
  street,
  complement,
  number,
  neighborhood,
  cep,
}: CreateDemandRequest): Promise<CreateDemandResponse> {
  await api.post(
    `organizations/${organizationSlug}/units/${unitSlug}/applicants/${applicantSlug}/demands`,
    {
      json: {
        organizationSlug,
        unitSlug,
        applicantSlug,
        title,
        description,
        priority,
        category,
        street,
        complement,
        number,
        neighborhood,
        cep,
      },
    },
  )
}
