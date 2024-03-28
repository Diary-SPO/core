/**
 * Утилитарный тип, который делает каждое свойство объекта T либо строкой, либо числом.
 */

export type StringOrNumber<T> = {
  [K in keyof T]: string | number
}

/**
 * Утилитарный тип для извлечения ключей, соответствующих строковым значениям,
 * из объекта типа T. Используется в контексте объектов с динамически заданными ключами.
 * @template T - Объект, из которого извлекаются ключи.
 */

type StringKeys<T> = keyof {
  [K in keyof T]: T[K] extends string ? K : never
}

export interface NumericParams {
  PORT: number
  DATABASE_PORT: number
}

export interface StringParams {
  SERVER_URL: string
  DATABASE_HOST: string
  DATABASE_NAME: string
  DATABASE_USERNAME: string
  DATABASE_PASSWORD: string
  TIMEZONE: string
}

export type ParamsKeys = StringKeys<ParamsInit>
export type ParamsInit = NumericParams & StringParams
