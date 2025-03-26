import { api } from './api-client'

interface CreateApplicantRequest {
  organizationSlug: String
  name: string
  birthdate: Date
  cpf: string
  phone: string
  mother: string | null
  father: string | null
  ticket: string | null
  observation: string | null
}

type CreateApplicantResponse = {
  applicantId: string
}

export async function createApplicant({
  organizationSlug,
  name,
  birthdate,
  cpf,
  phone,
  mother,
  father,
  ticket,
  observation,
}: CreateApplicantRequest): Promise<CreateApplicantResponse> {
  const response = await api
    .post(`organizations/${organizationSlug}/applicants`, {
      json: {
        name,
        birthdate,
        cpf,
        phone,
        mother,
        father,
        ticket,
        observation,
      },
    })
    .json<CreateApplicantResponse>()

  return response
}
