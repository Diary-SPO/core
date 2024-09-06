import { SERVER_URL } from '@config'
import type { ICacheData } from '@helpers'
import { HeadersWithCookie } from '@utils'
import ky from 'ky'

export const getPerformanceCurrent = async (authData: ICacheData) => {
  const path = `${SERVER_URL}/services/reports/current/performance/${authData.idFromDiary}`
  console.log(path)

  return ky.get(path, {
    headers: HeadersWithCookie(authData.cookie),
    timeout: 10000 // 10 seconds
  })
}
