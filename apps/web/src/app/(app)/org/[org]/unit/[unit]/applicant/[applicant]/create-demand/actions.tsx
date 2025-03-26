'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { createDemand } from '@/http/create-demand'
import {
  getCurrentApplicantId,
  getCurrentOrg,
  getCurrentUnit,
} from '@/auth/auth'
import { demandCategorySchema, demandPrioritySchema } from '@saas/auth'
import { applicantSchema } from '@saas/auth/src/models/applicant'
import { getApplicant } from '@/http/get-applicant'

const demandSchema = z.object({
  title: z
    .string()
    .min(4, { message: 'Por favor, inclua o título da demanda.' }),
  description: z
    .string()
    .min(30, { message: 'Por favor, detalhe a solicitação.' }),
  priority: demandPrioritySchema.refine((val) => !!val, {
    message: 'Por favor, selecione a prioridade da demanda.',
  }),
  category: demandCategorySchema.refine((val) => !!val, {
    message: 'Por favor, selecione a categoria da demanda.',
  }),
  street: z.string().nullable(),
  complement: z.string().nullable(),
  number: z.string().nullable(),
  neighborhood: z.string().nullable(),
  cep: z.string().nullable(),
  state: z.string().nullable(),
  city: z.string().nullable(),
})

export type DemandSchema = z.infer<typeof demandSchema>

export async function createDemandAction(data: FormData) {
  const currentOrg = await getCurrentOrg()
  const currentUnit = await getCurrentUnit()
  const currentApplicant = await getCurrentApplicantId()
  const result = demandSchema.safeParse(Object.fromEntries(data))
  console.log(result)

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const {
    title,
    description,
    priority,
    category,
    street,
    complement,
    number,
    neighborhood,
    cep,
    state,
    city,
  } = result.data

  try {
    await createDemand({
      organizationSlug: currentOrg!,
      unitSlug: currentUnit!,
      applicantSlug: currentApplicant!,
      title,
      description,
      priority,
      category,
      street,
      complement,
      number,
      neighborhood,
      cep,
      state,
      city,
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
    message: 'A demanda foi registrada com sucesso.',
    errors: null,
  }
}

export async function getApplicantAction(data: FormData) {
  const currentOrg = await getCurrentOrg()
  const currentApplicant = await getCurrentApplicantId()
  const result = applicantSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const {} = result.data // Extrair CPF do schema
  try {
    const applicant = await getApplicant({
      organizationSlug: currentOrg!,
      applicantSlug: currentApplicant!,
    })

    // Retorna somente name e birthdate, como você deseja
    return {
      success: true,
      applicant: {
        name: applicant.name,
        birthdate: applicant.birthdate,
      },
      message: null,
      errors: null,
    }
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
}
