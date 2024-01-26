export const BASE_URL = process.env.PUBLIC_SERVER_URL
export const SECOND_SERVER_URL = process.env.PUBLIC_SERVER_URL_SECOND
export const MODE = process.env.PUBLIC_MODE
export const BETA_VERSION = process.env.PUBLIC_BETA_VERSION

export const Mode = {
  DEV: 'dev',
  PROD: 'prod'
} as const

export const IS_DEV = MODE === Mode.DEV
