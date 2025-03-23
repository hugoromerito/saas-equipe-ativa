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
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import Link from 'next/link'
import { getOrganizations } from '@/http/get-organizations'
import { getCurrentOrg } from '@/auth/auth'

export async function OrganizationSwitcher() {
  const currentOrg = await getCurrentOrg()
  const { organizations } = await getOrganizations()

  const currentOrganization = organizations.find(
    (org) => org.slug === currentOrg,
  )

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus-visible:ring-primary flex w-[179px] cursor-pointer items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2">
          {currentOrganization ? (
            <>
              <Avatar className="mr-2 size-4">
                {currentOrganization.avatarUrl && (
                  <AvatarImage src={currentOrganization.avatarUrl} />
                )}
                <AvatarFallback />
              </Avatar>
              <span className="truncate text-left">
                {currentOrganization.name}
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">
              Selecionar organização
            </span>
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
            <DropdownMenuLabel>Organizações</DropdownMenuLabel>
            {organizations.map((organizations) => {
              return (
                <DropdownMenuItem
                  className="cursor-pointer"
                  key={organizations.id}
                  asChild
                >
                  <Link href={`/org/${organizations.slug}`}>
                    <Avatar className="mr-2 size-4">
                      {organizations.avatarUrl && (
                        <AvatarImage src={organizations.avatarUrl} />
                      )}
                      <AvatarFallback />
                    </Avatar>
                    <span className="line-clamp-1">{organizations.name}</span>
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/create-organization">
              <PlusCircle className="mr-2 size-4" />
              Criar organização
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
