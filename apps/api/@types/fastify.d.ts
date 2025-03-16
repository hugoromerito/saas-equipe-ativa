import 'fastify'

import { Organization, Member } from '@prisma/client'

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>
    getUserMembership(
      organizationSlug: string,
      unitSlug?: string,
    ): Promise<{ organization: Organization; membership: Member }>
  }
}
