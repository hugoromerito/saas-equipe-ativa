import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { CheckCircle, LogIn, LogOut, X } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth, getCurrentPendingInvite, isAuthenticated } from '@/auth/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { acceptInvite } from '@/http/accept-invite'
import { rejectInvite } from '@/http/reject-invite'

dayjs.extend(relativeTime).locale('pt-br')

interface InvitePageProps {
  params: {
    id: string
  }
}

export default async function InvitePage({ params }: InvitePageProps) {
  const invite = await getCurrentPendingInvite()
  const isUserAuthenticated = isAuthenticated()

  function getInitials(name: string): string {
    const initials = name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
    return initials
  }

  let currentUserEmail = null

  if (await isUserAuthenticated) {
    const { user } = await auth()

    currentUserEmail = user.email
  }

  const userIsAuthenticatedWithSameEmailFromInvite =
    currentUserEmail === invite?.email

  async function signInFromInvite() {
    'use server'
    // ;(await cookies()).set('inviteId', inviteId)

    redirect(`/auth/sign-in?email=${invite?.email}`)
  }

  async function acceptInviteAction() {
    'use server'

    if (!invite?.id) {
      return
    }

    await acceptInvite(invite?.id)

    redirect('/')
  }
  async function rejectInviteAction() {
    'use server'

    if (!invite?.id) {
      return
    }

    await rejectInvite(invite?.id)

    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col justify-center space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="size-16">
            {invite?.author?.avatarUrl && (
              <AvatarImage src={invite?.author.avatarUrl} />
            )}
            {invite?.author?.name && (
              <AvatarFallback>
                {getInitials(invite?.author?.name)}
              </AvatarFallback>
            )}
          </Avatar>

          <p className="text-muted-foreground text-center leading-relaxed text-balance">
            <span className="text-foreground font-medium">
              {invite?.author?.name ?? 'Someone'}
            </span>{' '}
            convidou você para participar da organização{' '}
            <span className="text-foreground font-medium">
              {invite?.unit?.organization.name}
            </span>
            .{' '}
            <span className="text-xs">
              {dayjs(invite?.createdAt).fromNow()}
            </span>
          </p>
        </div>

        <Separator />

        {!isUserAuthenticated && (
          <form action={signInFromInvite}>
            <Button type="submit" variant="secondary" className="w-full">
              <LogIn className="mr-2 size-4" />
              Entre para aceitar o convite
            </Button>
          </form>
        )}

        {userIsAuthenticatedWithSameEmailFromInvite && (
          <div className="flex flex-col space-y-4">
            <form action={acceptInviteAction}>
              <Button type="submit" variant="secondary" className="w-full">
                <CheckCircle className="mr-2 size-4" />
                Juntar-se {invite.unit?.organization.name}
              </Button>
            </form>
            <form action={rejectInviteAction}>
              <Button type="submit" variant="destructive" className="w-full">
                <X className="mr-2 size-4" />
                Recusar convite
              </Button>
            </form>
          </div>
        )}

        {(await isUserAuthenticated) &&
          !userIsAuthenticatedWithSameEmailFromInvite && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-center text-sm leading-relaxed text-balance">
                Este convite foi enviado para{' '}
                <span className="text-foreground font-medium">
                  {invite?.email}
                </span>{' '}
                mas você está atualmente autenticado como{' '}
                <span className="text-foreground font-medium">
                  {currentUserEmail}
                </span>
                .
              </p>

              <div className="space-y-2">
                <Button className="w-full" variant="secondary" asChild>
                  <a href="/api/auth/sign-out">
                    <LogOut className="mr-2 size-4" />
                    Sair {currentUserEmail}
                  </a>
                </Button>

                <Button className="w-full" variant="outline" asChild>
                  <Link href="/">Voltar para tela inicial</Link>
                </Button>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}
