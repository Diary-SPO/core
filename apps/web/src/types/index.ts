import type {
  AbsenceTypesDescriptionKeys,
  AdditionalMarks,
  MarkKeys
} from '@diary-spo/shared'
import type { AxiosResponse } from 'axios'

export type Pages = 'schedule' | 'marks' | 'settings' | 'notifications'

export interface Storage {
  key: string
  value: string
}

export type ServerResponse<T = unknown> = Promise<T | AxiosResponse>

export const HTTP_STATUSES = {
  /** Ошибка авторизации **/
  UNAUTHORIZED: 401,
  /** Rate limit **/
  RATE_LIMIT: 429,
  /** Неизвестная **/
  TEAPOT: 520,
  /** Internal Server Error **/
  INTERNAL: 500
} as const

export type ReturnedMark =
  | MarkKeys
  | AbsenceTypesDescriptionKeys
  | AdditionalMarks
  | 'ДЗ'
  | '.'
  | number
