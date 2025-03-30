// src/http/update-demand-status.ts
import { api } from './api-client'
import { DemandStatus } from '@saas/auth'

interface UpdateDemandRequest {
  organizationSlug: string
  unitSlug: string
  demandSlug: string
  status: DemandStatus
}

export async function updateDemand({
  organizationSlug,
  unitSlug,
  demandSlug,
  status,
}: UpdateDemandRequest): Promise<void> {
  await api.patch(
    `organizations/${organizationSlug}/units/${unitSlug}/demands/${demandSlug}`,
    { json: { status } },
  )
}
