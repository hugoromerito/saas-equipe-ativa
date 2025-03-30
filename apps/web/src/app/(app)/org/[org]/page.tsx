import { Header } from '@/components/header'
import { UnitList } from './unit-list'

export default async function OrganizationUnits() {
  return (
    // <div className="px-14 py-4">
    //   {/* <Header /> */}
    //   <main>
    //     <h1>Selecione a unidade</h1>
    //   </main>
    // </div>

    <>
      <Header />
      <main className="">
        <UnitList />
      </main>
    </>
  )
}
