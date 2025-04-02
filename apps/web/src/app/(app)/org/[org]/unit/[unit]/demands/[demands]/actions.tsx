'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { demandStatusSchema } from '@saas/auth'
import { getCurrentDemand, getCurrentOrg, getCurrentUnit } from '@/auth/auth'
import { updateDemand } from '@/http/update-demand-status'

const updateDemandSchema = z.object({
  // description: z
  //   .string()
  //   .min(30, { message: 'Por favor, detalhe a solicitação.' }),
  status: demandStatusSchema.refine((val) => !!val, {
    message: 'Por favor, selecione o status da demanda.',
  }),
})

export type UpdateDemandSchema = z.infer<typeof updateDemandSchema>

export async function updateDemandAction(data: FormData) {
  const currentOrg = await getCurrentOrg()
  const currentUnit = await getCurrentUnit()
  const currentDemand = await getCurrentDemand()
  const result = updateDemandSchema.safeParse(Object.fromEntries(data))
  console.log(result)

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { status } = result.data

  try {
    await updateDemand({
      organizationSlug: currentOrg!,
      unitSlug: currentUnit!,
      demandSlug: currentDemand!,
      status,
    })

    revalidateTag('demands')
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, errors: null }
    }

    console.error(err)

    return {
      success: false,
      message: 'Erro inesperado, tente novamente em alguns minutos.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'A demanda foi atualizada com sucesso.',
    errors: null,
  }
}
