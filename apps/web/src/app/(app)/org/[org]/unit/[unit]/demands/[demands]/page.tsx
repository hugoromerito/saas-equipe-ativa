import { ability } from '@/auth/auth'
import { Header } from '@/components/header'
import { DemandDetails } from './demand-details'

export default async function DemandsPage() {
  const permissions = await ability()

  return (
    <>
      <Header />
      <div className="flex w-full flex-col items-center justify-center gap-8 md:flex-row">
        {/* {permissions?.can('get', 'Demand') && <MemberList />} */}
        <DemandDetails />
      </div>
    </>
  )
}
