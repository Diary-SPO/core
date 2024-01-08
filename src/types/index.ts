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

export type ServerResponse<T = unknown> = Promise<T | 418 | 429 | 401 | number>

export const loginPattern = /^[a-zA-Z0-9а-яА-ЯёЁ-]+$/
