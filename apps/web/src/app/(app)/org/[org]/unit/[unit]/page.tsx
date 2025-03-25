import { FileSearch, NotebookPen, UserSearch } from 'lucide-react'
import Link from 'next/link'

import { ability, getCurrentOrg, getCurrentUnit } from '@/auth/auth'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'

export default async function Projects() {
  const currentOrg = await getCurrentOrg()
  const currentUnit = await getCurrentUnit()
  const permissions = await ability()

  return (
    <>
      <Header />
      <div>
        <div className="flex w-full flex-col items-center justify-center gap-8 md:flex-row">
          <Button
            variant={'secondary'}
            className={
              permissions?.can('create', 'Demand')
                ? 'text-md flex h-40 w-1/2 flex-col justify-center gap-4 font-normal md:h-80 md:w-1/4 md:text-xl'
                : 'hidden'
            }
            asChild
          >
            <Link href={`/org/${currentOrg}/unit/${currentUnit}/applicant`}>
              <NotebookPen strokeWidth={0.8} className="size-14 md:size-24" />
              Registrar Demanda
            </Link>
          </Button>

          <Button
            variant={'secondary'}
            className={
              permissions?.can('get', 'Demand')
                ? 'text-md flex h-40 w-1/2 flex-col justify-center gap-4 font-normal md:h-80 md:w-1/4 md:text-xl'
                : 'hidden'
            }
            asChild
          >
            <Link href={`/org/${currentOrg}/unit/${currentUnit}/demands`}>
              <FileSearch strokeWidth={0.8} className="size-14 md:size-24" />
              Visualizar Demandas
            </Link>
          </Button>

          <Button
            variant={'secondary'}
            className={
              permissions?.can('get', 'Applicant')
                ? 'text-md flex h-40 w-1/2 flex-col justify-center gap-4 font-normal md:h-80 md:w-1/4 md:text-xl'
                : 'hidden'
            }
            asChild
          >
            <Link href={`/org/${currentOrg}/unit/${currentUnit}/members`}>
              <UserSearch strokeWidth={0.8} className="size-14 md:size-24" />
              Visualizar Membros
            </Link>
          </Button>
        </div>

        {/* {permissions?.can('get', 'Demand') ? (
        <h1>teste</h1>
      ) : (
        <p className="text-muted-foreground text-sm">
          You are not allowed to see organization projects.
        </p>
      )} */}
      </div>
    </>
  )
}
