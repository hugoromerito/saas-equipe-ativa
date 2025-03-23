import { Header } from '@/components/header'
import { ApplicantForm } from './create-applicant-form'
import { getCurrentOrg, getCurrentUnit } from '@/auth/auth'

export default async function CreateDemandPage() {
  const org = await getCurrentOrg()
  const unit = await getCurrentUnit()
  return (
    <>
      <Header />
      <main>
        <h1 className="pb-4 text-2xl font-bold">
          Selecione o solicitante da demanda
        </h1>
        <ApplicantForm organizationSlug={org} unitSlug={unit} />
      </main>
    </>
  )
}
