import { PerformanceCurrent } from '@diary-spo/shared'
import { ICacheData } from '@helpers'
import { getPerformanceCurrent } from './getPerformanceCurrent'
import { getPerformanceFromDB } from './getPerformanceFromDB'
import { savePerfomance } from './savePerfomance'

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
