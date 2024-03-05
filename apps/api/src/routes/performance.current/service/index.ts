import { SERVER_URL } from '@config'
import { PerformanceCurrent } from '@diary-spo/shared'
import { ICacheData } from '@helpers'
import { HeadersWithCookie } from '@utils'

export const getCurrPerformance = async (authData: ICacheData): Promise<PerformanceCurrent | null> => {
  const path = `${SERVER_URL}/services/reports/current/performance/${authData.idFromDiary}`
  const response = await fetch(path, {
    headers: HeadersWithCookie(authData.cookie)
  })

  if (!response.ok) {
    // Возвращаем из базы
    return null
  }

  const result = await response.json()

  // Сохраняем в базе
  //savePerformance(result, authData)

  return result
}
