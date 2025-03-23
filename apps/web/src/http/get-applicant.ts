import { api } from './api-client'

interface GetApplicantResponse {
  id: string
  name: string
  birthdate: string
}

interface GetApplicantRequest {
  organizationSlug: string
  applicantSlug: string
}

export async function getApplicant({
  organizationSlug,
  applicantSlug,
}: GetApplicantRequest): Promise<GetApplicantResponse> {
  const result = await api
    .get(`organizations/${organizationSlug}/applicant/${applicantSlug}`)
    .json<GetApplicantResponse>()

  return result
}
