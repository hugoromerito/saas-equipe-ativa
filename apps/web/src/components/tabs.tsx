import { ability, getCurrentOrg, getCurrentUnit } from '@/auth/auth'

import { Button } from './ui/button'
import { NavLink } from './nav-link'

export async function Tabs() {
  const currentOrg = await getCurrentOrg()
  const currentUnit = await getCurrentUnit()

  const permissions = await ability()

  const canCreateDemands = permissions?.can('create', 'Demand')
  const canGetDemands = permissions?.can('get', 'Demand')
  const canGetMembers = permissions?.can('get', 'Applicant')
  const canGetUnits = permissions?.can('get', 'Unit')

  return (
    <nav className="grid grid-cols-2 gap-2 md:flex md:max-w-[1200px] md:items-center md:gap-2">
      {canGetUnits && (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground border border-transparent"
        >
          <NavLink href={`/org/${currentOrg}`}>Unidades</NavLink>
        </Button>
      )}

      {canCreateDemands && currentUnit && (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground border border-transparent"
        >
          <NavLink href={`/org/${currentOrg}/unit/${currentUnit}/applicant`}>
            Registrar demandas
          </NavLink>
        </Button>
      )}

      {canGetDemands && currentUnit && (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground border border-transparent"
        >
          <NavLink href={`/org/${currentOrg}/unit/${currentUnit}/demands`}>
            Visualizar demandas
          </NavLink>
        </Button>
      )}
      {canGetMembers && currentUnit && (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground border border-transparent"
        >
          <NavLink href={`/org/${currentOrg}/unit/${currentUnit}/members`}>
            Visualizar membros
          </NavLink>
        </Button>
      )}
    </nav>
  )
}
