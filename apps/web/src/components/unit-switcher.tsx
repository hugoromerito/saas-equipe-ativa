import { ChevronsUpDown, PlusCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { ability, getCurrentUnit } from '@/auth/auth'

export async function UnitSwitcher() {
  const currentOrg = (await cookies()).get('org')?.value
  const currentUni = (await cookies()).get('unit')?.value

  const units = await getCurrentUnit()

  const currentUnit = units?.find((uni) => uni.slug === currentUni)

  const permissions = await ability()
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus-visible:ring-primary flex w-[153px] cursor-pointer items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2">
          {currentUnit ? (
            <>
              <span className="truncate text-left">{currentUnit.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Selecionar unidade</span>
          )}
          <ChevronsUpDown className="text-muted-foreground ml-auto size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          alignOffset={-10}
          sideOffset={12}
          className="w-[173px]"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>Unidades</DropdownMenuLabel>
            {units?.map((units) => {
              return (
                <DropdownMenuItem
                  className="cursor-pointer"
                  key={units.id}
                  asChild
                >
                  <Link href={`${currentOrg}/unit/${units.slug}`}>
                    <span className="line-clamp-1">{units.name}</span>
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuGroup>
          {permissions?.can('create', 'Unit') && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/create-unit">
                  <PlusCircle className="mr-2 size-4" />
                  Criar unidade
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
