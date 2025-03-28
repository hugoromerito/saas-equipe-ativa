'use client'

import { ChevronDown, LogOut, Moon, Sun } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { useTheme } from 'next-themes'
import { Button } from './ui/button'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

interface ProfileClientProps {
  user: {
    name: string
    email: string
    avatarUrl?: string
  }
}

export function ProfileClientMobile({ user }: ProfileClientProps) {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex cursor-pointer items-center gap-3 outline-none">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-muted-foreground text-xs">{user.email}</span>
        </div>
        <Avatar className="size-10">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
          {user.name && (
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          )}
        </Avatar>
        <ChevronDown className="text-muted-foreground size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex cursor-pointer items-center justify-center"
          onClick={() => setTheme('light')}
        >
          <div className="justify-baseline">
            <Button size={'icon'} variant={'ghost'}>
              <Sun className="flex size-4" />
              <span className="sr-only">Alternar tema claro</span>
            </Button>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex cursor-pointer items-center justify-center"
          onClick={() => setTheme('dark')}
        >
          <div className="justify-baseline">
            <Button size={'icon'} variant={'ghost'}>
              <Moon className="flex size-4" />
              <span className="sr-only">Alternar tema escuro</span>
            </Button>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <a href="/api/auth/sign-out">
            <LogOut className="mr-2 size-4" />
            Sair
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
