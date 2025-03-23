import { ChevronsUpDown, PlusCircle } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'
import { cookies } from 'next/headers'

export async function ButtonCreateApplicant() {
  const currentOrg = (await cookies()).get('org')?.value

  return (
    <div>
      <div>
        <Button
          variant={'ghost'}
          className="focus-visible:ring-primary text-muted-foreground flex cursor-pointer items-center rounded text-sm font-medium outline-none focus-visible:ring-2"
          asChild
        >
          <Link href={`${currentOrg}/create-applicant`}>
            Cadastrar solicitante
            <PlusCircle className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
