import { ability } from '@/auth/auth'

import { MemberList } from './member-list'
import { Header } from '@/components/header'

export default async function MembersPage() {
  const permissions = await ability()

  return (
    <>
      <Header />
      <div className="flex w-full flex-col items-center justify-center gap-8 md:flex-row">
        {/* {permissions?.can('get', 'Invite') && <Invites />} */}
        {/* {permissions?.can('get', 'User') && <MemberList />} */}
        <MemberList />
      </div>
    </>
  )
}
