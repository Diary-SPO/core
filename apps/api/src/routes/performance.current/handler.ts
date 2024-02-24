import { SERVER_URL } from '@config'
import { getCookieFromToken } from '@db'
import type { PerformanceCurrent } from '@diary-spo/shared'
import { ContextWithID } from '@types'
import { HeadersWithCookie } from '@utils'

const getPerformanceCurrent = async ({
  request
}: ContextWithID): Promise<PerformanceCurrent | string> => {
  const authData = await getCookieFromToken(request.headers.toJSON().secret)
  const path = `${SERVER_URL}/services/reports/current/performance/${authData.idFromDiary}`
  const response = await fetch(path, {
    headers: HeadersWithCookie(authData.cookie)
  })

  return await response.json()
}

export default getPerformanceCurrent
