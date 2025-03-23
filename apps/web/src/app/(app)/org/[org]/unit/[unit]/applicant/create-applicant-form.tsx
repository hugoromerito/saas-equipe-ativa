'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { isCPF } from 'validation-br'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useFormState } from '@/hooks/use-form-state'
import {
  createApplicantAction,
  getCheckApplicantAction,
  type ApplicantSchema,
} from './actions'

interface ApplicantFormProps {
  initialData?: ApplicantSchema
  organizationSlug: string | null
  unitSlug: string | null
}

export function ApplicantForm({
  organizationSlug,
  unitSlug,
}: ApplicantFormProps) {
  const router = useRouter()
  const [cpfInput, setCpfInput] = useState('')
  const [showFullForm, setShowFullForm] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const [birthdateInput, setBirthdateInput] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [ticketInput, setTicketInput] = useState('')

  const formAction = createApplicantAction
  const [{ errors, message, success, applicantId }, handleSubmit] =
    useFormState(formAction, (state) => {
      if (state.success && state.applicantId) {
        router.push(
          `/org/${organizationSlug}/unit/${unitSlug}/applicant/${state.applicantId}/create-demand`,
        )
      }
    })

  function strip(value: string): string {
    return value.replace(/\D/g, '') // remove tudo que não for dígito
  }

  function formatCPF(value: string) {
    const digits = strip(value).slice(0, 11)
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  function formatPhone(value: string) {
    const digits = strip(value).slice(0, 11)
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
  }

  function formatBirthdate(value: string) {
    const digits = strip(value).slice(0, 8)
    return digits
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
  }

  function formatTicket(value: string) {
    const digits = strip(value).slice(0, 12)
    return digits
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1 $2')
  }

  const handleCpfSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!isCPF(cpfInput)) {
      setErrorMessage('CPF inválido.')
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append('cpf', strip(cpfInput))

      const result = await getCheckApplicantAction(formData)

      if (result.success && result.applicant) {
        router.push(
          `/org/${organizationSlug}/unit/${unitSlug}/applicant/${result.applicant.id}/create-demand`,
        )
      } else {
        setErrorMessage(result.message || 'Solicitante não encontrado.')
        setShowFullForm(true)
      }
    })
  }

  return (
    <>
      {/* Formulário de CPF */}
      {!showFullForm && (
        <form onSubmit={handleCpfSubmit} className="mb-6 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              name="cpf"
              id="cpf"
              value={formatCPF(cpfInput)}
              onChange={(e) => {
                const value = strip(e.target.value).slice(0, 11)
                setCpfInput(value)
              }}
            />
          </div>

          {errorMessage && (
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle>
                Solicitante não encontrado ou cpf inválido!
              </AlertTitle>
              <AlertDescription>
                <p>{errorMessage}</p>
              </AlertDescription>
            </Alert>
          )}

          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Buscar solicitante'
            )}
          </Button>
        </form>
      )}

      {/* Formulário completo só aparece se CPF não estiver cadastrado */}
      {showFullForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {success === false && message && (
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle>Falha ao registrar solicitante!</AlertTitle>
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
            <Label htmlFor="name">Nome completo</Label>
            <Input name="name" id="name" />
            {errors?.name && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.name[0]}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="birthdate">Data de nascimento</Label>
            <Input
              name="birthdate"
              id="birthdate"
              value={formatBirthdate(birthdateInput)}
              onChange={(e) => {
                const value = strip(e.target.value).slice(0, 8)
                setBirthdateInput(value)
              }}
            />
            <input
              type="hidden"
              name="birthdate"
              value={strip(birthdateInput)}
            />

            {errors?.birthdate && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.birthdate[0]}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="cpf">CPF</Label>
            <Input name="cpf" id="cpf" defaultValue={cpfInput} readOnly />
            <input type="hidden" name="cpf" value={strip(cpfInput)} />

            {errors?.cpf && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.cpf[0]}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              name="phone"
              id="phone"
              value={formatPhone(phoneInput)}
              onChange={(e) => {
                const value = strip(e.target.value).slice(0, 11)
                setPhoneInput(value)
              }}
            />
            <input type="hidden" name="phone" value={strip(phoneInput)} />

            {errors?.phone && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.phone[0]}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="mother">Nome da mãe</Label>
            <Input name="mother" id="mother" />
            {errors?.mother && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.mother[0]}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="father">Nome do pai</Label>
            <Input name="father" id="father" />
            {errors?.father && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.father[0]}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="ticket">Título</Label>
            <Input
              name="ticket"
              id="ticket"
              value={formatTicket(ticketInput)}
              onChange={(e) => {
                const value = strip(e.target.value).slice(0, 12)
                setTicketInput(value)
              }}
            />
            <input type="hidden" name="ticket" value={strip(ticketInput)} />

            {errors?.ticket && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.ticket[0]}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="observation">Observação</Label>
            <Input name="observation" id="observation" />
            {errors?.observation && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.observation[0]}
              </p>
            )}
          </div>

          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Registrar solicitante'
            )}
          </Button>
        </form>
      )}
    </>
  )
}
