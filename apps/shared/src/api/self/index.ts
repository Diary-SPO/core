import { Person } from '../../base.ts'

export interface PersonResponse {
  person: Person & {
    login: string
    phone: string
    birthday: string
    isTrusted: boolean
    isEsiaBound: boolean
  }
}

/**
 * Структура ответа на запрос авторизации (/login)
 */
export type ResponseLogin = Person & {
  spoId?: number
  groupId: number
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
