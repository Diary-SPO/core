import 'dotenv/config'
export const BASE_URL = process.env.VITE_SERVER_URL
export const SECOND_SERVER_URL = process.env.VITE_SERVER_URL_SECOND
console.log(process.env.BAR); // '1'
export const MODE = process.env.VITE_MODE

export const Mode = {
  DEV: 'dev',
  PROD: 'prod'
} as const

export const IS_DEV = MODE === Mode.DEV
