import { z } from 'zod'

/*
  Unidades de Atendimento
  ownerId - Identificador único do dono da unidade
*/
export const unitSchema = z.object({
  __typename: z.literal('Unit').default('Unit'),
  id: z.string(),
  ownerId: z.string(),
})

export type Unit = z.infer<typeof unitSchema>
