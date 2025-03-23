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

type Priority = {
  value: string
  label: string
}

const priorityOptions: Priority[] = [
  { value: 'LOW', label: 'Baixa' },
  { value: 'MEDIUM', label: 'Média' },
  { value: 'HIGH', label: 'Alta' },
  { value: 'URGENT', label: 'Urgente' },
]

export function ComboBoxPriority({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [selectedPriority, setSelectedPriority] =
    React.useState<Priority | null>(null)

  return (
    <>
      <input
        type="hidden"
        id={id}
        name={name}
        value={selectedPriority?.value || ''}
      />

      {isDesktop ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-80 justify-center truncate">
              {selectedPriority ? (
                <>{selectedPriority.label}</>
              ) : (
                <>Selecionar prioridade</>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="center">
            <PriorityList
              setOpen={setOpen}
              setSelectedPriority={setSelectedPriority}
            />
          </PopoverContent>
        </Popover>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DialogTitle hidden>Prioridade</DialogTitle>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-80 justify-center truncate">
              {selectedPriority ? (
                <>{selectedPriority.label}</>
              ) : (
                <>Selecionar prioridade</>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mt-4 border-t">
              <PriorityList
                setOpen={setOpen}
                setSelectedPriority={setSelectedPriority}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}

function PriorityList({
  setOpen,
  setSelectedPriority,
}: {
  setOpen: (open: boolean) => void
  setSelectedPriority: (priority: Priority | null) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="Filtrar categoria..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup>
          {priorityOptions.map((priority) => (
            <CommandItem
              key={priority.value}
              value={priority.value}
              onSelect={(value) => {
                setSelectedPriority(
                  priorityOptions.find(
                    (priority) => priority.value === value,
                  ) || null,
                )
                setOpen(false)
              }}
            >
              {priority.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
