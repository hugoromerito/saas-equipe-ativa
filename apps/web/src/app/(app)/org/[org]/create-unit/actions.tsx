'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { getCurrentOrg } from '@/auth/auth'
import { createUnit } from '@/http/create-unit'

const unitSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Por favor, inclua pelo menos 4 caracteres.' }),
  description: z.string().nullable(),
  location: z
    .string()
    .min(4, {
      message: 'Por favor, insira o endereço completo da unidade.',
    })
    .refine((value) => value.split(' ').length > 1, {
      message: 'Por favor, insira o endereço completo da unidade.',
    }),
})

export type UnitSchema = z.infer<typeof unitSchema>

export async function createUnitAction(data: FormData) {
  const currentOrg = await getCurrentOrg()
  const result = unitSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { name, description, location } = result.data

  try {
    await createUnit({
      organizationSlug: currentOrg!,
      name,
      description,
      location,
    })

    revalidateTag('units')
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
    message: 'A unidade foi criada com sucesso.',
    errors: null,
  }
}

// export async function updateUnitAction(data: FormData) {
//   const currentOrg = await getCurrentOrg()

//   const result = unitSchema.safeParse(Object.fromEntries(data))

//   if (!result.success) {
//     const errors = result.error.flatten().fieldErrors

//     return { success: false, message: null, errors }
//   }

//   const { name, domain, shouldAttachUsersByDomain } = result.data

//   try {
//     await updateUnit({
//       org: currentOrg!,
//       name,
//       domain,
//       shouldAttachUsersByDomain,
//     })

//     revalidateTag('units')
//   } catch (err) {
//     if (err instanceof HTTPError) {
//       const { message } = await err.response.json()

//       return { success: false, message, errors: null }
//     }

//     console.error(err)

//     return {
//       success: false,
//       message: 'Erro inesperado, tente novamente em alguns minutos.',
//       errors: null,
//     }
//   }

//   return {
//     success: true,
//     message: 'A organização foi criada com sucesso.',
//     errors: null,
//   }
// }
