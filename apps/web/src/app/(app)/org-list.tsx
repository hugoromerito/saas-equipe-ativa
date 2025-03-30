import { Flag, MapPin } from 'lucide-react'

import { getCurrentOrg, getCurrentUnit } from '@/auth/auth'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getOrganizations } from '@/http/get-organizations'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export async function OrgList() {
  const currentOrg = await getCurrentOrg()
  const { organizations } = await getOrganizations()

  const currentOrganization = organizations.find(
    (org) => org.slug === currentOrg,
  )

  function getInitials(name: string): string {
    const initials = name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
    return initials
  }

  return (
    <div className="w-full space-y-2">
      <h2 className="text-lg font-semibold">Organizações</h2>
      <p className="text-muted-foreground text-sm">Selecione a organização</p>

      {organizations.length === 0 ? (
        <p className="text-muted-foreground">
          Nenhuma organização registrada até o momento.
        </p>
      ) : (
        <div className="rounded border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Avatar</TableHead>
                <TableHead>Nome</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((organization) => (
                <TableRow key={organization.id}>
                  <TableCell>
                    <Avatar className="size-10">
                      {organization.avatarUrl && (
                        <AvatarImage src={organization.avatarUrl} />
                      )}
                      {organization.name && (
                        <AvatarFallback>
                          {getInitials(organization.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </TableCell>
                  <TableCell className="py-2.5 font-medium">
                    <Link href={`org/${organization.slug}`}>
                      {organization.name}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
