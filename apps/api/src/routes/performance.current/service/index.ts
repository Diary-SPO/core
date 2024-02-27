import { SERVER_URL } from '@config'
import { ICacheData } from '@helpers'
import { HeadersWithCookie } from '@utils'
import { savePerformance } from './save'

export const getCurrPerformance = async (authData: ICacheData) => {
  const path = `${SERVER_URL}/services/reports/current/performance/${authData.idFromDiary}`
  const response = await fetch(path, {
    headers: HeadersWithCookie(authData.cookie)
  })

  if (!response.ok) {
    // Возвращаем из базы
  }

  const result = await response.json()

  // Сохраняем в базе
  savePerformance(result, authData)

  return result
}
