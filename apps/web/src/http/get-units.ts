import { api } from './api-client'

interface getUnitsResponse {
  units: {
    id: string
    name: string
    slug: string
    location: string
    description: string | null
  }[]
}

export async function getUnits() {
  const result = await api.get('units').json<getUnitsResponse>()

  return result
}
