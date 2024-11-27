import type { With } from '@diary-spo/shared'

export interface IServerInfo {
  status: string
  arch: string
  targetDiary: string
  backend: string
  commit: string
}

export interface Token {
  token: string
}

export type WithToken<T> = With<T, Token>

export interface TokenInfo extends Token {
  tokenId: bigint
}
