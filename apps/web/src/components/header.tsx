import Image from 'next/image'
import eaLogo from '@/assets/eabeta-logo.svg'
import { ProfileButton } from './profile-button'
import { Slash } from 'lucide-react'
import { OrganizationSwitcher } from './organization-switcher'
import { UnitSwitcher } from './unit-switcher'
import { ability } from '@/auth/auth'
import { ButtonCreateApplicant } from './button-create-applicant'
import { ThemeSwitcher } from './theme/theme-switcher'
import Link from 'next/link'

export async function Header() {
  const permissions = await ability()
  return (
    <div className="mx-auto mb-4 flex max-w-[1200px] flex-col items-center justify-between border-b pb-2 md:flex-row">
      <div className="flex w-full items-center justify-between md:justify-normal">
        <Link href="/">
          <Image
            src={eaLogo}
            alt="Equipe Ativa"
            className="size-20 md:size-16"
          />
        </Link>

        <Slash className="text-border hidden size-3 -rotate-[24deg] md:flex" />

        <div className="hidden items-center justify-center md:flex md:flex-row">
          <OrganizationSwitcher />
          <Slash className="text-border hidden size-3 -rotate-[24deg] md:flex" />
          <UnitSwitcher />
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <ProfileButton />
        </div>
      </div>

      <div className="flex items-center justify-center md:hidden">
        <OrganizationSwitcher />
        <Slash className="text-border hidden size-3 -rotate-[24deg] md:flex" />
        <UnitSwitcher />
      </div>

      <div className="hidden items-center gap-4 md:flex">
        <ThemeSwitcher />
        <Slash className="text-border size-3 -rotate-45" />
        <ProfileButton />
      </div>
    </div>
  )
}
