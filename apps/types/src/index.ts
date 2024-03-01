import { Person } from '@diary-spo/shared'

export interface PersonResponse {
  person: {
    birthday: string
    id: number
    isEsiaBound: boolean
    login: string
    phone: string
    firstName: string
    isTrusted: boolean
    lastName: string
    middleName: string
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
