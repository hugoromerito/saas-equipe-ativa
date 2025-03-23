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

type Category = {
  value: string
  label: string
}

const categoryOptions: Category[] = [
  { value: 'INFRASTRUCTURE', label: 'Infraestrutura e Serviços Públicos' },
  { value: 'HEALTH', label: 'Saúde Pública' },
  { value: 'EDUCATION', label: 'Educação e Creches' },
  { value: 'SOCIAL_ASSISTANCE', label: 'Assistência Social' },
  { value: 'PUBLIC_SAFETY', label: 'Segurança Pública' },
  { value: 'TRANSPORTATION', label: 'Transporte e Mobilidade' },
  { value: 'EMPLOYMENT', label: 'Emprego e Desenvolvimento Econômico' },
  { value: 'CULTURE', label: 'Cultura, Esporte e Lazer' },
  { value: 'ENVIRONMENT', label: 'Meio Ambiente e Sustentabilidade' },
  { value: 'HUMAN_RIGHTS', label: 'Direitos Humanos e Cidadania' },
  { value: 'TECHNOLOGY', label: 'Tecnologia e Inovação' },
]

export function ComboBoxCategory({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [selectedCategory, setSelectedCategory] =
    React.useState<Category | null>(null)

  return (
    <>
      <input
        type="hidden"
        id={id}
        name={name}
        value={selectedCategory?.value || ''}
      />
      {isDesktop ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-80 justify-center truncate">
              {selectedCategory ? (
                <>{selectedCategory.label}</>
              ) : (
                <>Selecionar categoria</>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="center">
            <CategoryList
              setOpen={setOpen}
              setSelectedCategory={setSelectedCategory}
            />
          </PopoverContent>
        </Popover>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DialogTitle hidden>Categoria</DialogTitle>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-80 justify-center truncate">
              {selectedCategory ? (
                <>{selectedCategory.label}</>
              ) : (
                <>Selecionar categoria</>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mt-4 border-t">
              <CategoryList
                setOpen={setOpen}
                setSelectedCategory={setSelectedCategory}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}

function CategoryList({
  setOpen,
  setSelectedCategory,
}: {
  setOpen: (open: boolean) => void
  setSelectedCategory: (category: Category | null) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="Filtrar categoria..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup>
          {categoryOptions.map((category) => (
            <CommandItem
              key={category.value}
              value={category.value}
              onSelect={(value) => {
                setSelectedCategory(
                  categoryOptions.find(
                    (priority) => priority.value === value,
                  ) || null,
                )
                setOpen(false)
              }}
            >
              {category.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
