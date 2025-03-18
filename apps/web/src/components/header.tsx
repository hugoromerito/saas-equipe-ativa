import Image from 'next/image'
import eaLogo from '@/assets/ea-logo.svg'
import { ProfileButton } from './profile-button'
import { Slash } from 'lucide-react'
import { OrganizationSwitcher } from './organization-switcher'
import { UnitSwitcher } from './unit-switcher'

export function Header() {
  return (
    <div className="max-w[1200px] mx-auto flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Image src={eaLogo} alt="Equipe Ativa" className="size-16" />

        <Slash className="text-border size-3 -rotate-[24deg]" />

        <OrganizationSwitcher />
        <Slash className="text-border size-3 -rotate-[24deg]" />
        <UnitSwitcher />
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </div>
  )
}
