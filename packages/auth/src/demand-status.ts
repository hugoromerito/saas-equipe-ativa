import { z } from 'zod'

export const demandStatusSchema = z.union([
  z.literal('PENDING'), // Aguardando atendimento
  z.literal('IN_PROGRESS'), // Em andamento
  z.literal('RESOLVED'), // Resolvida
  z.literal('REJECTED'), // Rejeitada (não atende critérios)
])

export type DemandStatus = z.infer<typeof demandStatusSchema>
