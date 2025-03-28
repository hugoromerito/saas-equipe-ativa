import { ability, getCurrentOrg } from '@/auth/auth'

import { Button } from './ui/button'
import { NavLink } from './nav-link'

export async function Tabs() {
  const currentOrg = await getCurrentOrg()

  const permissions = await ability()

  const canUpdateOrganization = permissions?.can('update', 'Organization')
  const canGetBilling = permissions?.can('get', 'Billing')

  const canGetMembers = permissions?.can('get', 'User')
  const canGetUnits = permissions?.can('get', 'Unit')

  return (
    <nav className="flex max-w-[1200px] items-center gap-2">
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

      {canGetMembers && (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground border border-transparent"
        >
          <NavLink href={`/org/${currentOrg}/members`}>Membros</NavLink>
        </Button>
      )}

      {(canUpdateOrganization || canGetBilling) && (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground border border-transparent"
        >
          <NavLink href={`/org/${currentOrg}/settings`}>Configurações</NavLink>
        </Button>
      )}
    </nav>
  )
}
