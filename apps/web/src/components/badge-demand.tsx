import type { VariantProps } from 'class-variance-authority'
import { badgeVariants } from './ui/badge'
import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'

export function BadgeDemand({
  className,
  variant,
  priority,
  status,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    status?: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'
  }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, priority, status }), className)}
      {...props}
    />
  )
}
