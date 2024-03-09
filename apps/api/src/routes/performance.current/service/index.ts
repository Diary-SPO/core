import { SERVER_URL } from '@config'
import { PerformanceCurrent } from '@diary-spo/shared'
import { ICacheData } from '@helpers'
import { HeadersWithCookie } from '@utils'
import { getPerformanceCurrent } from './getPerformanceCurrent'

export const getCurrPerformance = async (
  authData: ICacheData
): Promise<PerformanceCurrent | null> => {
  const response = await getPerformanceCurrent(authData)

  if (!response.ok) {
    // Возвращаем из базы
    return null
  }

  const result = await response.json()

  // Сохраняем в базе
  //savePerformance(result, authData)

  return result
}
