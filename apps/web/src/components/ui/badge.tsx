import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      },
      priority: {
        LOW: 'bg-green-500/20 text-green-700 dark:bg-green-400/10 dark:text-green-400',
        MEDIUM:
          'bg-yellow-500/20 text-yellow-700 dark:bg-yellow-400/10 dark:text-yellow-400',
        HIGH: 'bg-orange-500/20 text-orange-700 dark:bg-orange-400/10 dark:text-orange-500',
        URGENT:
          'bg-red-600/20 text-red-700 dark:bg-red-400/10 dark:text-red-500',
      },
      status: {
        PENDING:
          'bg-zinc-400/20 text-zinc-700 dark:bg-zinc-300/10 dark:text-zinc-300',
        IN_PROGRESS:
          'bg-blue-500/20 text-blue-700 dark:bg-blue-400/10 dark:text-blue-400',
        RESOLVED:
          'bg-emerald-500/20 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400',
        REJECTED:
          'bg-red-500/20 text-red-700 dark:bg-red-400/10 dark:text-red-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
