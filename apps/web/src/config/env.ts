export const BASE_URLS = import.meta.env.VITE_SERVER_URLS?.split(',')
export const SERVER_URL = import.meta.env.VITE_SERVER_URL
export const MODE = import.meta.env.VITE_MODE
export const ADMIN_PAGE = import.meta.env.VITE_ADMIN_PAGE_URL
export const BETA_VERSION = import.meta.env.VITE_BETA_VERSION

export const Mode = {
  DEV: 'dev',
  PROD: 'prod'
} as const

export const IS_DEV = MODE === Mode.DEV
