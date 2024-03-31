export * from './converterTypes'

import type { Context } from 'elysia'

/**
 * Интерфейс для ответа.
 */
export interface IResponse {
  errors?: unknown
  title?: unknown
}

/**
 * Интерфейс контекста с расширенными свойствами.
 */
export interface IContext extends Context {
  response: IResponse | number
}

export interface ContextWithID extends Omit<Context, 'params'> {
  params: {
    id: string
  }
}

export interface IServerInfo {
  status: string
  arch: string
  targetDiary: string
  backend: string
  commit: string
}
