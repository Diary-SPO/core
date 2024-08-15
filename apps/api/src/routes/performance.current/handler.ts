import type { PerformanceCurrent } from '@diary-spo/shared'

import { getCookieFromToken } from '@helpers'

import type { Token } from '../../types'
import { getCurrPerformance } from './service'

type Params = Token

export const getPerformanceCurrent = async ({
  token
}: Params): Promise<PerformanceCurrent> => {
  const authData = await getCookieFromToken(token)
  return getCurrPerformance(authData)
}
