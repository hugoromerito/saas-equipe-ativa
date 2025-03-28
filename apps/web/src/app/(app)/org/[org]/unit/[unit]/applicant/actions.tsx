'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js/max'

import { createApplicant } from '@/http/create-applicant'
import { getCurrentOrg } from '@/auth/auth'
import { getCheckApplicant } from '@/http/get-check-applicant-slug'
import { isTituloEleitor } from 'validation-br'
const nameValidation = (value: string) => {
  const trimmed = value.trim()
  return trimmed.length >= 4 && trimmed.split(' ').length > 1
}

const birthdateSchema = z
  .string()
  .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
    message: 'Formato de data inválido.',
  })
  .refine(
    (val) => {
      const [year, month, day] = val.split('-').map(Number)
      const date = new Date(year, month - 1, day)
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      )
    },
    {
      message: 'Data de nascimento inválida.',
    },
  )
  .transform((val) => new Date(val))

const nullableNameSchema = z.preprocess(
  (val) => {
    if (typeof val === 'string' && val === 'null') return null
    return val
  },
  z.union([
    z.string().refine(nameValidation, {
      message: 'Por favor, insira o nome completo.',
    }),
    z.null(),
  ]),
)

const nullableTicketSchema = z.preprocess(
  (val) => {
    if (typeof val === 'string' && val === 'null') return null
    return val
  },
  z.union([
    z.string().refine(isTituloEleitor, {
      message: 'Por favor, insira o título válido.',
    }),
    z.null(),
  ]),
)

const applicantSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Por favor, insira o nome completo.' })
    .refine((value) => value.split(' ').length > 1, {
      message: 'Por favor, insira o nome completo.',
    }),
  birthdate: birthdateSchema,
  cpf: z.string().min(11, { message: 'Por favor, insira o CPF válido.' }),
  phone: z.string().refine(
    (value) => {
      const phoneNumber = parsePhoneNumberFromString(value, 'BR')
      return phoneNumber !== undefined && phoneNumber.isValid()
    },
    { message: 'Insira um número válido.' },
  ),
  mother: nullableNameSchema,
  father: nullableNameSchema,
  ticket: nullableTicketSchema,
  observation: z.string().nullable(),
})

type CreateApplicantState = {
  success: boolean
  message: string | null
  errors: Record<string, string[]> | null
  applicantId?: string // <- optional, mas estará presente no sucesso
}

export type ApplicantSchema = z.infer<typeof applicantSchema>

export async function createApplicantAction(
  data: FormData,
): Promise<CreateApplicantState> {
  const currentOrg = await getCurrentOrg()
  const result = applicantSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { name, birthdate, cpf, father, mother, observation, phone, ticket } =
    result.data

  try {
    const response = await createApplicant({
      organizationSlug: currentOrg!,
      name,
      birthdate,
      cpf,
      father,
      mother,
      observation,
      phone,
      ticket,
    })

    revalidateTag('applicants')

    return {
      success: true,
      message: 'Solicitante cadastrado com sucesso.',
      errors: null,
      applicantId: response.applicantId,
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

export async function getCheckApplicantAction(data: FormData) {
  const cpfSchema = z.object({
    cpf: z.string().min(11, { message: 'CPF inválido.' }),
  })

  const currentOrg = await getCurrentOrg()
  const result = cpfSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { cpf } = result.data

  try {
    const applicant = await getCheckApplicant({
      organizationSlug: currentOrg!,
      cpf,
    })

    return {
      success: true,
      applicant,
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
