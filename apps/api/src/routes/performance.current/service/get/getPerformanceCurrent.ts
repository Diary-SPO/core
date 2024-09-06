import { SERVER_URL } from '@config'
import type { ICacheData } from '@helpers'
import { HeadersWithCookie } from '@utils'
import { fetcher } from 'src/utils/fetcher'

export const getPerformanceCurrent = async (authData: ICacheData) => {
  const path = `${SERVER_URL}/services/reports/current/performance/${authData.idFromDiary}`
  console.log(path)

  return fetcher.get(path, {
    headers: HeadersWithCookie(authData.cookie)
  })
}
