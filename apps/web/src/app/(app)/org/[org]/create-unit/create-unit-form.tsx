'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useFormState } from '@/hooks/use-form-state'
import { createUnitAction, type UnitSchema } from './actions'

interface UnitFormProps {
  isUpdating?: boolean
  initialData?: UnitSchema
}

export function UnitForm({ initialData }: UnitFormProps) {
  const formAction = createUnitAction
  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    formAction,
    () => {},
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Falha ao criar unidade!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      {success === true && message && (
        <Alert variant="success">
          <AlertTriangle className="size-4" />
          <AlertTitle>Sucesso!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="name">Nome da unidade</Label>
        <Input name="name" id="name" defaultValue={initialData?.name} />

        {errors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Descrição da unidade</Label>
        <Input name="description" id="description" />

        {errors?.description && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.description[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="location">Endereço da unidade</Label>
        <Input name="location" id="location" />

        {errors?.location && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.location[0]}
          </p>
        )}
      </div>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Registrar unidade'
        )}
      </Button>
    </form>
  )
}
