import { Header } from '@/components/header'
import { UnitForm } from './create-unit-form'

export default function CreateUnitPage() {
  return (
    <>
      <h1 className="pb-4 text-2xl font-bold">Criar unidade</h1>

      <UnitForm />
    </>
  )
}
