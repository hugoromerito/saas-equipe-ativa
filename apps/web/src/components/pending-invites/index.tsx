import { Check, UserPlus2, X } from 'lucide-react'
import { Button } from '../ui/button'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { getCurrentPendingInvites } from '@/auth/auth'
import Link from 'next/link'

dayjs.extend(relativeTime).locale('pt-br')

export async function PendingInvites() {
  const invites = await getCurrentPendingInvites()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={'icon'} variant={'ghost'} className="">
          <UserPlus2 className="size-4" />
          <span className="sr-only">Convites pendentes</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 space-y-2 p-2">
        <span className="block text-sm font-medium">
          Convites pendentes ({invites.length ?? 0})
        </span>

        {invites.map((invite) => {
          return (
            <div className="space-y-2" key={invite.id}>
              <Link href={`/invites/${invite.id}`}>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  <span className="text-foreground font-medium">
                    {invite.author?.name ?? 'Alguém'}
                  </span>{' '}
                  convidou você para participar da organização{' '}
                  <span className="text-foreground font-medium">
                    {invite.unit?.organization.name ?? ' '}
                  </span>{' '}
                  <span>- {dayjs(invite.createdAt).fromNow()}</span>
                </p>
                <DropdownMenuSeparator />
              </Link>
            </div>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
