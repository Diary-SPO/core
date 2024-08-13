import type { PerformanceCurrent } from '@diary-spo/shared'
import type { ICacheData } from '@helpers'
import { getPerformanceFromDB } from './get'
import { getPerformanceCurrent } from './get'
import { savePerformance } from './save'

export const getCurrPerformance = async (
  authData: ICacheData
): Promise<PerformanceCurrent> => {
  const response = await getPerformanceCurrent(authData)

  if (!response.ok) {
    // Возвращаем из базы
    return getPerformanceFromDB(authData)
  }

  const result = await response.json()

  // Сохраняем в базе
  savePerformance(result, authData)

  return result
}
