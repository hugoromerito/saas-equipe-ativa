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
import { getUnits } from '@/http/get-units'

export async function UnitSwitcher() {
  const currentUni = (await cookies()).get('org')?.value
  const { units } = await getUnits()

  const currentUnit = units.find((uni) => uni.slug === currentUni)
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus-visible:ring-primary flex w-[179px] cursor-pointer items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2">
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
          className="w-[200px]"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>Unidades</DropdownMenuLabel>
            {units.map((units) => {
              return (
                <DropdownMenuItem
                  className="cursor-pointer"
                  key={units.id}
                  asChild
                >
                  <Link href={`org//unit/${units.slug}`}>
                    <span className="line-clamp-1">{units.name}</span>
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/create-unit">
              <PlusCircle className="mr-2 size-4" />
              Criar unidade
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
