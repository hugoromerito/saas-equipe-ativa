import { Header } from '@/components/header'
import { DemandForm } from './create-demand-form'
import { ApplicantName } from '@/components/applicant-name'

export default function CreateDemandPage() {
  return (
    <>
      <Header />
      <main>
        <h1 className="pb-4 text-2xl font-bold">Registrar demanda</h1>
        <ApplicantName />
        <DemandForm />
      </main>
    </>
  )
}
