import { api } from './api-client'

interface GetUnitsResponse {
  units: {
    id: string
    name: string
    slug: string
    location: string
    description: string | null
  }[]
}

export async function getUnits(org: string) {
  const result = await api
    .get(`organizations/${org}/units`)
    .json<GetUnitsResponse>()

  return result
}
