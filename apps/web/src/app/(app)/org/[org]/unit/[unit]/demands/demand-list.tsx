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

import { getDemands } from '@/http/get-demands'
import {
  translateCategory,
  translatePriority,
  translateStatus,
} from '@/constants/demand-translations'
import { BadgeDemand } from '@/components/badge-demand'

export async function DemandList() {
  const currentOrg = await getCurrentOrg()
  const currentUnit = await getCurrentUnit()

  const { demands } = await getDemands({
    organizationSlug: currentOrg!,
    unitSlug: currentUnit!,
  })

  return (
    <div className="w-full space-y-2">
      <h2 className="text-lg font-semibold">Demandas</h2>

      {demands.length === 0 ? (
        <p className="text-muted-foreground">
          Nenhuma demanda registrada até o momento.
        </p>
      ) : (
        <div className="rounded border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Título</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Categoria</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demands.map((demand) => (
                <TableRow key={demand.id}>
                  <TableCell className="py-2.5 font-medium">
                    {demand.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground py-2.5 text-sm">
                    {demand.description}
                  </TableCell>
                  <TableCell>
                    <BadgeDemand status={demand.status}>
                      {translateStatus(demand.status)}
                    </BadgeDemand>
                  </TableCell>
                  <TableCell>
                    <BadgeDemand priority={demand.priority}>
                      {translatePriority(demand.priority)}
                    </BadgeDemand>
                  </TableCell>
                  <TableCell>
                    <BadgeDemand variant={'secondary'}>
                      {translateCategory(demand.category)}
                    </BadgeDemand>
                  </TableCell>
                  {/* <TableCell className="text-muted-foreground py-2.5 text-xs">
                            <div className="flex items-center gap-1">
                              <Flag className="size-3" />
                              {translatePriority(demand.priority)} -{' '}
                              {translateStatus(demand.status)}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="size-3" />
                              {[
                                demand.street,
                                demand.number,
                                demand.neighborhood,
                                demand.city,
                                demand.state,
                              ]
                                .filter(Boolean)
                                .join(', ')}
                            </div>
                          </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
