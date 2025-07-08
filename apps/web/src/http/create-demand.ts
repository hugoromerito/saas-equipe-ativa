import { api } from './api-client'

interface CreateDemandRequest {
  organizationSlug: String
  unitSlug: String
  applicantSlug: String
  title: String
  description: String
  cep: String | null
  state: String | null
  city: String | null
  street: String | null
  complement: String | null
  number: String | null
  neighborhood: String | null
}

type CreateDemandResponse = void

export async function createDemand({
  organizationSlug,
  unitSlug,
  applicantSlug,
  title,
  description,
  street,
  complement,
  number,
  neighborhood,
  cep,
  state,
  city,
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
        street,
        complement,
        number,
        neighborhood,
        cep,
        state,
        city,
      },
    },
  )
}
