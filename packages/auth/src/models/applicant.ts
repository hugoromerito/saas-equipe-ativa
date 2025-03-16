import { z } from 'zod'

/*
  Unidades de Atendimento
  ownerId - Identificador único do dono da unidade
*/
export const applicantSchema = z.object({
  __typename: z.literal('Applicant').default('Applicant'),
  id: z.string(),
  ownerId: z.string(),
})

export type Applicant = z.infer<typeof applicantSchema>
