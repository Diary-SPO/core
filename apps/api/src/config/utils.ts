import type { ParamsInit, ParamsKeys, StringOrNumber } from './types'

/**
 * Считывает .env файл
 * Проверяет наличие всех полей из ParamsInit в конфигурационном файле
 * @param {ParamsInit} params
 */
const checkEnvVariables = (params: StringOrNumber<ParamsInit>): void => {
  for (const key of Object.keys(params) as ParamsKeys[]) {
    const value = Bun.env[key] ?? params[key]

    if (typeof value !== 'number' && String(value).trim() === '') {
      throw new Error(`Environment variable ${key} is not defined or empty.`)
    }

    params[key] = value
  }
}

export default checkEnvVariables
