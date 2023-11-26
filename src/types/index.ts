export type Pages =
  | 'schedule'
  | 'contacts'
  | 'marks'
  | 'settings'
  | 'attestation'
  | 'notifications'

export interface Storage {
  key: string
  value: string
}

export type ServerResponse<T> = Promise<T | 418 | 429>

export const loginPattern = /^[a-zA-Z0-9а-яА-ЯёЁ-]+$/
