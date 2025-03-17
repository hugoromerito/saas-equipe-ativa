import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

import googleIcon from '@/assets/google-icon.svg'
import Image from 'next/image'

export default function SignUpPage() {
  return (
    <form action="" className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Nome</Label>
        <Input name="name" id="name" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Senha</Label>
        <Input name="password" type="password" id="password" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password_confirmation">Confirme sua senha</Label>
        <Input
          name="password_confirmation"
          type="password_confirmation"
          id="password_confirmation"
        />
      </div>

      <Button type="submit" className="w-full">
        Criar conta
      </Button>
      <Button variant="link" className="w-full" size="sm" asChild>
        <Link href="/auth/sign-in">Já possui conta? Entrar</Link>
      </Button>

      <Separator />

      <Button className="w-full" variant="outline">
        <Image src={googleIcon} className="mr-2 size-4" alt="" />
        Criar conta com Google
      </Button>
    </form>
  )
}
