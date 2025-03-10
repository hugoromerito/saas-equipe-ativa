import { z } from 'zod'

import { unitSchema } from '../models/unit'

export const unitSubject = z.tuple([
  z.union([
    z.literal('create'), // Cria uma nova unidade
    z.literal('get'), // Visualiza uma unidade
    z.literal('update'), // Atualiza uma unidade
    z.literal('delete'), // Deleta uma unidade
    z.literal('transfer_ownership'), // Transfere a propriedade de uma unidade
    z.literal('manage'), // Gerencia uma unidade (geralmente é usado para permissões de administrador)
  ]),
  z.union([z.literal('Unit'), unitSchema]),
])

export type UnitSubject = z.infer<typeof unitSubject>
