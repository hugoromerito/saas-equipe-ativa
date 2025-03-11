import { z } from 'zod'

/*
  Unidades de Atendimento
  ownerId - Identificador único do dono da unidade
*/
export const organizationSchema = z.object({
  __typename: z.literal('Organization').default('Organization'),
  id: z.string(),
  ownerId: z.string(),
})

export type Organization = z.infer<typeof organizationSchema>
