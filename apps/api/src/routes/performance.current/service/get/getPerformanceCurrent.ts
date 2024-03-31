import { SERVER_URL } from '@config'
import type { ICacheData } from '@helpers'
import { HeadersWithCookie } from '@utils'

export const getPerformanceCurrent = async (authData: ICacheData) => {
  const path = `${SERVER_URL}/services/reports/current/performance/${authData.idFromDiary}`
  console.log(path)
  const response = fetch(path, {
    headers: HeadersWithCookie(authData.cookie)
  })
  return response
}
