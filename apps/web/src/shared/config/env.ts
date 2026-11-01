// export const BASE_URLS = import.meta.env.VITE_SERVER_URLS?.split(',')

const readEnvString = (value: unknown): string => {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (!trimmed || trimmed === 'false' || trimmed === 'undefined') return ''
  return trimmed
}

export const MODE = import.meta.env.VITE_MODE
export const ADMIN_PAGE = import.meta.env.VITE_ADMIN_PAGE_URL
export const BETA_VERSION = readEnvString(import.meta.env.VITE_BETA_VERSION)
export const APP_VERSION =
  readEnvString(import.meta.env.VITE_APP_VERSION) || BETA_VERSION || '8.0.0'
export const API_URL = import.meta.env.VITE_SERVER_URL
export const DIARY_SOURCE = import.meta.env.VITE_DIARY_SOURCE ?? 'server'
export const PRIVACY_POLICY_URL =
  import.meta.env.VITE_PRIVACY_POLICY_URL?.trim() ?? ''
export const USER_AGREEMENT_URL =
  import.meta.env.VITE_USER_AGREEMENT_URL?.trim() ?? ''
export const PERSONAL_DATA_CONSENT_URL =
  import.meta.env.VITE_PERSONAL_DATA_CONSENT_URL?.trim() ?? ''

export const Mode = {
  DEV: 'dev',
  PROD: 'prod'
} as const

export const IS_DEV = MODE === Mode.DEV
