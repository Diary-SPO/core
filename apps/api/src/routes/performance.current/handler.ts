import type { PerformanceCurrent } from '@diary-spo/shared'

import { getCookieFromToken } from '@helpers'
import type { ContextWithID } from '@types'

import { getPerformanceCurrentService } from './service'

const getPerformanceCurrent = async ({
  request
}: ContextWithID): Promise<PerformanceCurrent> => {
  const authData = await getCookieFromToken(request.headers.toJSON().secret)

  return getPerformanceCurrentService(authData)
}

export default getPerformanceCurrent
