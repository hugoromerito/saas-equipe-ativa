'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useMediaQuery } from '@/hooks/use-media-query'
import { DialogTitle } from '../ui/dialog'

type Status = {
  value: string
  label: string
}

const statusOptions: Status[] = [
  // { value: 'PENDING', label: 'Aguardando atendimento' },
  { value: 'IN_PROGRESS', label: 'Em andamento' },
  { value: 'RESOLVED', label: 'Resolvida' },
  { value: 'REJECTED', label: 'Rejeitada' },
]

export function ComboBoxStatus({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(
    null,
  )

  return (
    <>
      <input
        type="hidden"
        id={id}
        name={name}
        value={selectedStatus?.value || ''}
      />

      {isDesktop ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-80 justify-center truncate">
              {selectedStatus ? (
                <>{selectedStatus.label}</>
              ) : (
                <>Selecionar status</>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="center">
            <StatusList
              setOpen={setOpen}
              setSelectedStatus={setSelectedStatus}
            />
          </PopoverContent>
        </Popover>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DialogTitle hidden>Status</DialogTitle>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-80 justify-center truncate">
              {selectedStatus ? (
                <>{selectedStatus.label}</>
              ) : (
                <>Selecionar status</>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mt-4 border-t">
              <StatusList
                setOpen={setOpen}
                setSelectedStatus={setSelectedStatus}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}

function StatusList({
  setOpen,
  setSelectedStatus,
}: {
  setOpen: (open: boolean) => void
  setSelectedStatus: (status: Status | null) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="Filtrar categoria..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup>
          {statusOptions.map((status) => (
            <CommandItem
              key={status.value}
              value={status.value}
              onSelect={(value) => {
                setSelectedStatus(
                  statusOptions.find((status) => status.value === value) ||
                    null,
                )
                setOpen(false)
              }}
            >
              {status.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
