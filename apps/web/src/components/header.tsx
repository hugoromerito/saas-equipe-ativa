import Image from 'next/image'
import eaLogo from '@/assets/eabeta-logo.svg'
import { ProfileButton } from './profile-button'
import { Slash } from 'lucide-react'
import { OrganizationSwitcher } from './organization-switcher'
import { UnitSwitcher } from './unit-switcher'
import { ability } from '@/auth/auth'
import { ButtonCreateApplicant } from './button-create-applicant'
import { ThemeSwitcher } from './theme/theme-switcher'

export async function Header() {
  const permissions = await ability()
  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between border-b pb-2">
      <div className="flex items-center gap-3">
        <Image src={eaLogo} alt="Equipe Ativa" className="size-16" />

        <Slash className="text-border size-3 -rotate-[24deg]" />

        <OrganizationSwitcher />
        <Slash className="text-border size-3 -rotate-[24deg]" />
        <UnitSwitcher />
        <Slash className="text-border size-3 -rotate-[24deg]" />
        {permissions?.can('create', 'Applicant') && <ButtonCreateApplicant />}
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <Slash className="text-border size-3 -rotate-45" />
        <ProfileButton />
      </div>
    </div>
  )
}
