import { api } from './api-client'

interface UpdateOrganizationRequest {
  org: string
  name: string
}

type UpdateOrganizationResponse = void

export async function updateOrganization({
  org,
  name,
}: UpdateOrganizationRequest): Promise<UpdateOrganizationResponse> {
  await api.put(`organizations/${org}`, {
    json: {
      name,
    },
  })
}
