import { defineAbilityFor, demandSchema } from '@saas/auth'

const ability = defineAbilityFor({ role: 'MANAGER', id: 'user-id' })

const demand = demandSchema.parse({ id: 'demand-id', ownerId: 'user2-id' })

console.log(ability.can('get', demand)) // true
