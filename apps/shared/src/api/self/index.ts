import type { Person } from '../../base.ts'

export interface PersonResponse {
  persons: Array<
    Person & {
      login: string
      phone: string
      birthday: string
      isTrusted: boolean
      isEsiaBound: boolean
    }
  >
}

/**
 * Структура ответа на запрос авторизации (/login)
 */
export type ResponseLogin = Person & {
  id: bigint
  spoId?: bigint
  groupId: bigint
  organization: {
    abbreviation: string
    addressSettlement: string
  }
  login: string
  phone?: string
  birthday: string
  groupName: string
  token: string
}
