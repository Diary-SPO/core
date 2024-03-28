import { PerformanceCurrent } from '@diary-spo/shared'
import { ICacheData } from '@helpers'
import { getPerformanceCurrent } from './get/getPerformanceCurrent'
import { getPerformanceFromDB } from './get'
import { savePerfomance } from './save/savePerfomance'

export const getCurrPerformance = async (
  authData: ICacheData
): Promise<PerformanceCurrent | null> => {
  const response = await getPerformanceCurrent(authData)

  if (!response.ok) {
    // Возвращаем из базы
    return getPerformanceFromDB(authData)
  }

  const result = await response.json()

  // Сохраняем в базе
  savePerfomance(result, authData)

  return result
}
