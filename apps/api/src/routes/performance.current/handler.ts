import { SERVER_URL } from '@config'
import { getCookieFromToken } from '@db'
import type { PerformanceCurrent } from '@diary-spo/shared'
import { ContextWithID } from '@types'
import { HeadersWithCookie } from '@utils'
import { getCurrPerformance } from './service'

const getPerformanceCurrent = async ({
  request
}: ContextWithID): Promise<PerformanceCurrent | string> => {
  const authData = await getCookieFromToken(request.headers.toJSON().secret)
  return await getCurrPerformance(authData)
}

export default getPerformanceCurrent
