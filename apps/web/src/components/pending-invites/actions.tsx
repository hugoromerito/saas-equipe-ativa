import { acceptInvite } from '@/http/accept-invite'

export async function acceptInviteAction(inviteId: string) {
  await acceptInvite(inviteId)
}

export async function rejectInviteAction(inviteId: string) {
  await acceptInvite(inviteId)
}
