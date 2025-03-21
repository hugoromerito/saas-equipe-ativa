import { api } from './api-client'

interface CreateUnitRequest {
  organizationSlug: string
  name: string
  description: string | null
  location: string
}

type CreateUnitResponse = void

export async function createUnit({
  organizationSlug,
  name,
  description,
  location,
}: CreateUnitRequest): Promise<CreateUnitResponse> {
  await api.post(`organizations/${organizationSlug}/units`, {
    json: {
      name,
      description,
      location,
    },
  })
}
