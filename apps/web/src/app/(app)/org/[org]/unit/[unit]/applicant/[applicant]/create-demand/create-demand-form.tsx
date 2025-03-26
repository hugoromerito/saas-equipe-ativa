'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import cepPromise from 'cep-promise'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useFormState } from '@/hooks/use-form-state'
import { createDemandAction, type DemandSchema } from './actions'
import { Textarea } from '@/components/ui/textarea'
import { ComboBoxCategory } from '@/components/switchs/category-switcher'
import { ComboBoxPriority } from '@/components/switchs/priority-switcher'
import { useEffect, useState } from 'react'

interface DemandFormProps {
  initialData?: DemandSchema
}

export function DemandForm({ initialData }: DemandFormProps) {
  const [cepInput, setCepInput] = useState('')

  // Estado para armazenar os dados do endereço
  const [address, setAddress] = useState({
    state: '',
    city: '',
    street: '',
    neighborhood: '',
  })

  const formAction = createDemandAction

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    formAction,
    () => {},
  )

  function strip(value: string): string {
    return value.replace(/\D/g, '') // remove tudo que não for dígito
  }

  function formatCep(value: string) {
    const digits = strip(value).slice(0, 8)
    return digits.replace(/(\d{5})(\d{1,3})/, '$1-$2')
  }

  // useEffect que dispara a busca pelo CEP quando ele tiver 8 dígitos
  useEffect(() => {
    if (cepInput.length === 8) {
      cepPromise(cepInput)
        .then((result) => {
          setAddress({
            state: result.state || '',
            city: result.city || '',
            neighborhood: result.neighborhood || '',
            street: result.street || '',
          })
        })
        .catch((err) => {
          console.error('Erro ao buscar CEP:', err)
        })
    }
  }, [cepInput])

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Falha ao registrar demanda!</AlertTitle>
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
          <Label htmlFor="title">Título</Label>
          <Input name="title" id="title" />

          {errors?.title && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.title[0]}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            name="description"
            placeholder="Descreva a solicitação detalhadamente."
            id="description"
          />

          {errors?.description && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.description[0]}
            </p>
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-4 space-y-1 md:flex md:flex-row md:gap-8">
          <div className="flex flex-col items-center justify-center gap-1">
            <ComboBoxPriority id="priority" name="priority" />
            {errors?.priority && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                Por favor, selecione a prioridade da demanda.
              </p>
            )}
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <ComboBoxCategory id="category" name="category" />

            {errors?.category && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                Por favor, selecione a categoria da demanda
              </p>
            )}
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="cep">CEP</Label>
          <Input
            name="cep"
            id="cep"
            value={formatCep(cepInput)}
            onChange={(e) => {
              const value = strip(e.target.value).slice(0, 8)
              setCepInput(value)
            }}
          />
          <input type="hidden" name="cep" value={strip(cepInput)} />

          {errors?.cep && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.cep[0]}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="state">Estado</Label>
          <Input
            name="state"
            id="state"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
          />

          {errors?.state && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.state[0]}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="city">Cidade</Label>
          <Input
            name="city"
            id="city"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />

          {errors?.city && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.city[0]}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input
            name="neighborhood"
            id="neighborhood"
            value={address.neighborhood}
            onChange={(e) =>
              setAddress({ ...address, neighborhood: e.target.value })
            }
          />

          {errors?.neighborhood && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.neighborhood[0]}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="street">Logradouro</Label>
          <Input
            name="street"
            id="street"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
          />

          {errors?.street && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.street[0]}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="complement">Complemento</Label>
          <Input name="complement" id="complement" />

          {errors?.complement && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.complement[0]}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="number">Número</Label>
          <Input name="number" type="number" id="number" />

          {errors?.number && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.number[0]}
            </p>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Registrar demanda'
          )}
        </Button>
      </form>
    </>
  )
}
