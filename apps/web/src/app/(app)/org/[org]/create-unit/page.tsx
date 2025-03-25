import { Header } from '@/components/header'
import { UnitForm } from './create-unit-form'

export default function CreateUnitPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        <h1 className="text-2xl font-bold">Criar unidade</h1>

        <UnitForm />
      </main>
    </>
  )
}
