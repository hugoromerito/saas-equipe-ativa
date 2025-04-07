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
import { Checkbox } from '@/components/ui/checkbox'

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
  const [showFullForm, setShowFullForm] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Estados para os campos com checkbox
  const [name, setName] = useState('')
  const [mother, setMother] = useState('')
  const [motherNull, setMotherNull] = useState(false)
  const [father, setFather] = useState('')
  const [ticket, setTicket] = useState('')
  const [fatherNull, setFatherNull] = useState(false)
  const [ticketNull, setTicketNull] = useState(false)

  const [birthdateInput, setBirthdateInput] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [cpfInput, setCpfInput] = useState('')

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

  function convertBirthdateToISO(value: string) {
    // Remove qualquer caractere não numérico
    const digits = strip(value)
    if (digits.length === 8) {
      const day = digits.slice(0, 2)
      const month = digits.slice(2, 4)
      const year = digits.slice(4, 8)
      return `${year}-${month}-${day}`
    }
    return ''
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

  function formatName(value: string): string {
    return value
      .replace(/[^a-zA-ZÀ-ÿ\s]/g, '') // mantém apenas letras e espaços
      .replace(/\s+/g, ' ') // substitui múltiplos espaços por 1
      .trimStart() // remove espaço no início (mantém entre palavras)
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const handleCpfSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!isCPF(cpfInput)) {
      setErrorMessage('CPF inválido, tente novamente.')
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

          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Buscar solicitante'
            )}
          </Button>
          {errorMessage && (
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle>CPF inválido!</AlertTitle>
              <AlertDescription>
                <p>{errorMessage}</p>
              </AlertDescription>
            </Alert>
          )}
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
            <Input
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(formatName(e.target.value))}
            />

            {errors?.name && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.name[0]}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="birthdate">Data de nascimento</Label>
            <Input
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
              value={convertBirthdateToISO(birthdateInput)}
            />

            {errors?.birthdate && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.birthdate[0]}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="cpf">CPF</Label>
            <Input id="cpf" defaultValue={cpfInput} readOnly />
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
            <div className="flex items-center gap-2">
              <Input
                id="mother"
                value={motherNull ? 'null' : mother}
                onChange={(e) => setMother(formatName(e.target.value))}
                disabled={motherNull}
              />
              <input
                type="hidden"
                name="mother"
                id="mother"
                value={motherNull ? 'null' : mother}
              />
              <div className="flex items-start gap-1">
                <div className="translate-y-0.5">
                  <Checkbox
                    name="motherNull"
                    id="motherNull"
                    checked={motherNull}
                    onCheckedChange={(checked) => setMotherNull(!!checked)}
                  />
                </div>
                <label htmlFor="motherNull" className="space-y-1">
                  <span className="w-full text-sm leading-none font-medium whitespace-nowrap">
                    Não consta
                  </span>
                </label>
              </div>
            </div>
            {errors?.mother && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.mother[0]}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="father">Nome do pai</Label>
            <div className="flex items-center gap-2">
              <Input
                id="father"
                value={fatherNull ? 'null' : father}
                onChange={(e) => setFather(formatName(e.target.value))}
                disabled={fatherNull}
              />
              <input
                type="hidden"
                name="father"
                id="father"
                value={fatherNull ? 'null' : father}
              />
              <div className="flex items-start gap-1">
                <div className="translate-y-0.5">
                  <Checkbox
                    name="fatherNull"
                    id="fatherNull"
                    checked={fatherNull}
                    onCheckedChange={(checked) => setFatherNull(!!checked)}
                  />
                </div>
                <label htmlFor="fatherNull" className="space-y-1">
                  <span className="w-full text-sm leading-none font-medium whitespace-nowrap">
                    Não consta
                  </span>
                </label>
              </div>
            </div>
            {errors?.father && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.father[0]}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="ticket">Título</Label>
            <div className="flex items-center gap-2">
              <Input
                id="ticket"
                value={ticketNull ? 'null' : formatTicket(ticket)}
                onChange={(e) => {
                  const value = strip(e.target.value).slice(0, 12)
                  setTicket(value)
                }}
                disabled={ticketNull}
              />
              <input
                type="hidden"
                name="ticket"
                id="ticket"
                value={ticketNull ? 'null' : ticket}
              />
              <div className="flex items-start gap-1">
                <div className="translate-y-0.5">
                  <Checkbox
                    name="ticketNull"
                    id="ticketNull"
                    checked={ticketNull}
                    onCheckedChange={(checked) => setTicketNull(!!checked)}
                  />
                </div>
                <label htmlFor="ticketNull" className="space-y-1">
                  <span className="w-full text-sm leading-none font-medium whitespace-nowrap">
                    Não consta
                  </span>
                </label>
              </div>
            </div>

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
