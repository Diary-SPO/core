import type { Context } from 'elysia'

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
