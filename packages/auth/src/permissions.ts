import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { User } from './models/user'
import { Role } from './roles'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN: (user, { can, cannot }) => {
    can('manage', 'all')

    cannot(['transfer_ownership', 'update'], 'Unit')
    can(['transfer_ownership', 'update'], 'Unit', { ownerId: { $eq: user.id } })
  },
  MANAGER: (user, { can, cannot }) => {
    can('create', 'Demand') // Pode criar demandas
    can('get', 'Demand', { ownerId: { $eq: user.id } }) // Pode listar demandas próprias
    can('manage', 'User') // Pode gerenciar usuários
    cannot('delete', 'User') // Não pode deletar um usuário
  },
  CLERK: (user, { can }) => {
    can('create', 'Demand') // Pode criar demandas
    can('get', 'Demand', { ownerId: { $eq: user.id } }) // Pode listar demandas próprias
    can(['assign', 'create'], 'User') // Pode atribuir demandas e criar usuários
  },
  ANALYST: (_, { can }) => {
    can(['get', 'update'], 'Demand') // Pode listar e atualizar demandas
  },
  APPLICANT: (user, { can }) => {
    can('get', 'Demand', { ownerId: { $eq: user.id } }) // Pode listar demandas
  },
  BILLING: (_, { can }) => {
    can('manage', 'Billing')
  },
}
