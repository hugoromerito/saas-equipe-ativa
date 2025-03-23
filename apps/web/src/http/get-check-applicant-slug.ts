import { api } from './api-client'

interface GetCheckApplicantResponse {
  id: string
}

interface GetCheckApplicantRequest {
  organizationSlug: string
  cpf: string
}

export async function getCheckApplicant({
  organizationSlug,
  cpf,
}: GetCheckApplicantRequest) {
  const result = await api
    .post(`organizations/${organizationSlug}/applicant`, {
      json: { cpf },
    })
    .json<GetCheckApplicantResponse>()

  return result
}
