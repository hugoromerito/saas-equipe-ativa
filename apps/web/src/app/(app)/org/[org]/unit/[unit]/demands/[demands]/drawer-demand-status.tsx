'use client'

import { DemandStatus, demandStatusSchema } from '@saas/auth'
import { translateStatus } from '@/constants/demand-translations'
import { useTransition } from 'react'
import { updateDemand } from '@/http/update-demand-status'
import { updateDemandAction, type UpdateDemandSchema } from './actions'
import { useFormState } from '@/hooks/use-form-state'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { ComboBoxStatus } from '@/components/switchs/status-switcher'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/use-media-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type StatusOption = {
  value: DemandStatus
  label: string
}

export const statusOptions: StatusOption[] = [
  { value: 'IN_PROGRESS', label: 'Em andamento' },
  { value: 'RESOLVED', label: 'Resolvida' },
  { value: 'REJECTED', label: 'Rejeitada' },
]

interface DemandStatusControlProps {
  currentStatus: DemandStatus
  organizationSlug: string
  unitSlug: string
  demandSlug: string
}

interface DemandFormProps {
  initialData?: UpdateDemandSchema
}

// export function DemandStatusControl({ initialData }: DemandFormProps) {
// const formAction = updateDemandAction

// const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
//   formAction,
//   () => {},
// )

//   // const handleChange = (status: DemandStatus) => {
//   //   startTransition(async () => {
//   //     await updateDemand({
//   //       organizationSlug,
//   //       unitSlug,
//   //       demandSlug,
//   //       status,
//   //     })

//   //     // location.reload()
//   //   })
//   // }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       {success === false && message && (
//         <Alert variant="destructive">
//           <AlertTriangle className="size-4" />
//           <AlertTitle>Falha ao registrar demanda!</AlertTitle>
//           <AlertDescription>
//             <p>{message}</p>
//           </AlertDescription>
//         </Alert>
//       )}
//       {success === true && message && (
//         <Alert variant="success">
//           <AlertTriangle className="size-4" />
//           <AlertTitle>Sucesso!</AlertTitle>
//           <AlertDescription>
//             <p>{message}</p>
//           </AlertDescription>
//         </Alert>
//       )}
//       <div className="flex items-center justify-center gap-1">
//         <ComboBoxStatus id="status" name="status" />

//         {errors?.status && (
//           <p className="text-xs font-medium text-red-500 dark:text-red-400">
//             Por favor, selecione a categoria da demanda
//           </p>
//         )}
//       </div>
//       <Button className="w-full" type="submit" disabled={isPending}>
//         {isPending ? (
//           <Loader2 className="size-4 animate-spin" />
//         ) : (
//           'Atualizar demanda'
//         )}
//       </Button>
//     </form>
//   )
// }

export function DrawerDemandStatus() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full cursor-pointer">Atualizar demanda</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Atualizar demanda</DialogTitle>
            <DialogDescription>
              Dê andamento à demanda, selecione o status atual da demanda.
              Clique em salvar quando terminar.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Atualizar demanda</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Atualizar demanda</DrawerTitle>
          <DrawerDescription>
            Dê andamento à demanda, selecione o status atual da demanda. Clique
            em salvar quando terminar.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" setOpen={setOpen} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function ProfileForm({
  className,
  setOpen,
}: React.ComponentProps<'form'> & { setOpen?: (open: boolean) => void }) {
  const formAction = updateDemandAction

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    formAction,
    () => {},
  )

  // Fecha o Drawer ao ter sucesso
  React.useEffect(() => {
    if (success && setOpen) {
      setOpen(false)
    }
  }, [success, setOpen])

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('grid w-full items-start justify-center gap-4', className)}
    >
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Falha ao registrar demanda!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}
      <div className="flex-col items-center justify-center gap-1">
        <ComboBoxStatus id="status" name="status" />

        {errors?.status && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            Por favor, selecione o status da demanda
          </p>
        )}
      </div>
      {/* <div className="grid gap-2">
        <Label htmlFor="username">Descrição</Label>
        <Textarea id="username" />
      </div> */}
      <Button type="submit" disabled={isPending}>
        Salvar atualização
      </Button>
    </form>
  )
}
