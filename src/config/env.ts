export const BASE_URL = import.meta.env.VITE_SERVER_URL
export const SECOND_SERVER_URL = import.meta.env.VITE_SERVER_URL_SECOND

export const MODE = import.meta.env.VITE_MODE

export const Mode = {
  DEV: 'dev',
  PROD: 'prod'
} as const

export const IS_DEV = MODE === Mode.DEV
