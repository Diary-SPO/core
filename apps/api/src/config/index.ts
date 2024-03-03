import fs from 'fs'
import { PARAMS_INIT } from './params'
import checkEnvVariables from './utils'

if (!fs.existsSync('.env')) {
  throw new Error(
    'Configuration file ".env" not found. Read README for instructions on how to create.'
  )
}

checkEnvVariables(PARAMS_INIT)

export const {
  SERVER_URL,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  ENCRYPT_KEY,
  TIMEZONE
} = PARAMS_INIT
