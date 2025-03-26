import { api } from './api-client'

interface CreateOrganizationRequest {
  name: string
}

type CreateOrganizationResponse = void

export async function createOrganization({
  name,
}: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
  await api.post('organizations', {
    json: {
      name,
    },
  })
}
