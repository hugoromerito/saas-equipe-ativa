import { z } from 'zod'

export const demandPrioritySchema = z.union([
  z.literal('LOW'), // Baixa
  z.literal('MEDIUM'), // Média
  z.literal('HIGH'), // Alta
  z.literal('URGENT'), // Urgente
])

export type DemandPriority = z.infer<typeof demandPrioritySchema>
