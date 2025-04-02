import { ability } from '@/auth/auth'
import { Header } from '@/components/header'
import { DemandDetails } from './demand-details'
import { DrawerDemandStatus } from './drawer-demand-status'

export default async function DemandsPage() {
  const permissions = await ability()

  return (
    <>
      <Header />
      <div className="flex w-full flex-col items-center justify-center gap-8">
        {permissions?.can('get', 'Demand') && <DemandDetails />}
      </div>
    </>
  )
}
