import { getCurrentApplicant, getCurrentOrg, getCurrentUnit } from '@/auth/auth'
import { redirect } from 'next/navigation'

export async function ApplicantName() {
  const applicant = await getCurrentApplicant()
  const unitSlug = await getCurrentUnit()
  const organizationSlug = await getCurrentOrg()

  if (!applicant) {
    redirect(`/org/${organizationSlug}/unit/${unitSlug}/applicant`)
  }
  const currentApplicant = applicant

  function strip(value: string): string {
    return value.replace(/\D/g, '') // remove tudo que não for dígito
  }

  function formatBirthdate(value: string) {
    const digits = strip(value).slice(0, 8) // garante que só há 8 dígitos (YYYYMMDD)
    const year = digits.slice(0, 4)
    const month = digits.slice(4, 6)
    const day = digits.slice(6, 8)
    return `${day}/${month}/${year}`
  }

  return (
    <div className="flex flex-col pb-2">
      <h2 className="font-medium">Solicitante</h2>
      <span className="text-left text-sm">Nome: {currentApplicant!.name}</span>
      <span className="text-left text-sm">
        Data de nascimento: {formatBirthdate(currentApplicant!.birthdate)}
      </span>
    </div>
  )
}
