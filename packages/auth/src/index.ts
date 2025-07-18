import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability'
import { z } from 'zod'

import { User } from './models/user'
import { permissions } from './permissions'
import { billingSubject } from './subjects/billing'
import { demandSubject } from './subjects/demand'
import { inviteSubject } from './subjects/invite'
import { unitSubject } from './subjects/unit'
import { userSubject } from './subjects/user'
import { organizationSubject } from './subjects/organization'
import { applicantSubject } from './subjects/applicant'

export * from './models/user'
export * from './models/organization'
export * from './models/demand'
export * from './models/unit'
export * from './roles'
export * from './demand-category'
export * from './demand-priority'
export * from './demand-status'

const appAbilities = z.union([
  userSubject,
  unitSubject,
  applicantSubject,
  demandSubject,
  inviteSubject,
  billingSubject,
  organizationSubject,
  z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof appAbilities>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Permissions for role ${user.role} not found.`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename
    },
  })

  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)

  return ability
}
