import { Flag, MapPin } from 'lucide-react'

import { getCurrentOrg, getCurrentUnit, getCurrentUnits } from '@/auth/auth'
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

export async function UnitList() {
  const currentOrg = await getCurrentOrg()
  const currentUnitSlug = await getCurrentUnit()

  const units = await getCurrentUnits()

  const currentUnit = units?.find((unit) => unit.slug === currentUnitSlug)

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
      <h2 className="text-lg font-semibold">Unidades</h2>
      <p className="text-muted-foreground text-sm">Selecione a unidade</p>

      {units?.length === 0 ? (
        <p className="text-muted-foreground">
          Nenhuma organização registrada até o momento.
        </p>
      ) : (
        <div className="rounded border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units?.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="py-2.5 font-medium">
                    <Link href={`/org/${currentOrg}/unit/${unit.slug}`}>
                      {unit.name}
                    </Link>
                  </TableCell>

                  <TableCell className="text-muted-foreground py-2.5 text-xs">
                    <div className="flex items-center gap-1">
                      <Flag className="size-3" />
                      {unit.description}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      {[unit.location].filter(Boolean).join(', ')}
                    </div>
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
