'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { AlertTriangle, Loader2 } from 'lucide-react'

import googleIcon from '@/assets/google-icon.svg'
import Image from 'next/image'
import { signInWithEmailAndPassword } from './actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useFormState } from '@/hooks/use-form-state'
import { useRouter } from 'next/navigation'
import { signInWithGoogle } from '../actions'

export default function SignInForm() {
  const router = useRouter()
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    signInWithEmailAndPassword,
    () => {
      router.push('/')
    },
  )

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Falha ao entrar</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input name="email" type="email" id="email" />

          {errors?.email && (
            <p className="text-sm font-medium text-red-500 dark:text-red-400">
              {errors.email[0]}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Senha</Label>
          <Input name="password" type="password" id="password" />

          {errors?.password && (
            <p className="text-sm font-medium text-red-500 dark:text-red-400">
              {errors.password[0]}
            </p>
          )}

          <Link
            href="/auth/forgot-password"
            className="text-foreground text-xs font-medium hover:underline"
          >
            Esqueceu sua senha?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Entrar com e-mail'
          )}
        </Button>
        <Button variant="link" className="w-full" size="sm" asChild>
          <Link href="/auth/sign-up">Criar nova conta</Link>
        </Button>
      </form>
      <Separator />
      <form action={signInWithGoogle}>
        <Button type="submit" className="w-full" variant="outline">
          <Image src={googleIcon} className="mr-2 size-4" alt="" />
          Entrar com Google
        </Button>
      </form>
    </div>
  )
}
