'use client'

import { DemandStatus, demandStatusSchema } from '@saas/auth'
import { translateStatus } from '@/constants/demand-translations'
import { useTransition } from 'react'
import { updateDemand } from '@/http/update-demand-status'

type StatusOption = {
  value: DemandStatus
  label: string
}

export const statusOptions: StatusOption[] = [
  { value: 'PENDING', label: 'Aguardando atendimento' },
  { value: 'IN_PROGRESS', label: 'Em andamento' },
  { value: 'RESOLVED', label: 'Resolvida' },
  { value: 'REJECTED', label: 'Rejeitada' },
]

interface DemandStatusControlProps {
  currentStatus: DemandStatus
  organizationSlug: string
  unitSlug: string
  demandSlug: string
}

export function DemandStatusControl({
  currentStatus,
  organizationSlug,
  unitSlug,
  demandSlug,
}: DemandStatusControlProps) {
  const [isPending, startTransition] = useTransition()

  const handleChange = (status: DemandStatus) => {
    startTransition(async () => {
      await updateDemand({
        organizationSlug,
        unitSlug,
        demandSlug,
        status,
      })

      // location.reload()
    })
  }

  return (
    <div className="flex items-center gap-2">
      <select
        defaultValue={currentStatus}
        className="rounded border px-2 py-1 text-sm"
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value as DemandStatus)}
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
