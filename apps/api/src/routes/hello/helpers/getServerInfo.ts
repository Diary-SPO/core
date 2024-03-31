import * as process from 'node:process'
import { SERVER_URL } from '@config'
import type { IServerInfo } from '@types'
import { getGitCommitHash } from './'

export const getServerInfo = async (): Promise<IServerInfo> => {
  return {
    status: 'ok',
    arch: process.arch,
    targetDiary: SERVER_URL,
    backend: 'bun+elysia',
    commit: (await getGitCommitHash()) ?? 'noVersion'
  }
}
