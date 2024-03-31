import { getTimezone } from './getTimeZone'
import type { ParamsInit } from './types'

export const PARAMS_INIT: ParamsInit = {
  PORT: 3003,
  DATABASE_PORT: 5432,
  SERVER_URL: '',
  DATABASE_HOST: 'localhost',
  DATABASE_NAME: '',
  DATABASE_USERNAME: '',
  DATABASE_PASSWORD: '',
  TIMEZONE: getTimezone(),
  KEY_SCAN_PATH: './'
}
