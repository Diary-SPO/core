import type { PerformanceCurrent } from '@diary-spo/shared'

import { getCookieFromToken } from '@helpers'

import type { ContextWithID } from '../../types'
import { getCurrPerformance } from './service'

const getPerformanceCurrent = async ({
  request
}: ContextWithID): Promise<PerformanceCurrent | string> => {
  const authData = await getCookieFromToken(request.headers.toJSON().secret)
  return await getCurrPerformance(authData)
}

export default getPerformanceCurrent
