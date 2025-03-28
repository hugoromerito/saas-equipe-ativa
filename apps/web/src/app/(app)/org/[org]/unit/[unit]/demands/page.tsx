import { ability } from '@/auth/auth'
import { DemandList } from './demand-list'
import { Header } from '@/components/header'

export default async function DemandsPage() {
  const permissions = await ability()

  return (
    <>
      <Header />
      <div className="flex w-full flex-col items-center justify-center gap-8 md:flex-row">
        {/* {permissions?.can('get', 'Demand') && <MemberList />} */}
        <DemandList />
      </div>
    </>
  )
}
