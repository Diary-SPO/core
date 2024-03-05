import fs from 'fs'
import { PARAMS_INIT } from './params'
import checkEnvVariables from './utils'
import { rsa } from './rsa'

if (!fs.existsSync('.env')) {
  throw new Error(
    'Configuration file ".env" not found. Read README for instructions on how to create.'
  )
}

checkEnvVariables(PARAMS_INIT)

// Читаем или генерируем ключ
export const KEY = await rsa()

export const {
  SERVER_URL,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  TIMEZONE
} = PARAMS_INIT