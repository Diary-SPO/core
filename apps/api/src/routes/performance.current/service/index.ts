import type { PerformanceCurrent } from '@diary-spo/shared'
import type { ICacheData } from '@helpers'
import { getPerformanceFromDB } from './get'
import { getPerformanceCurrent } from './get'
import { savePerformance } from './save'

export const getCurrPerformance = async (
  authData: ICacheData,
  systemInitiator = false // Инициировано системой и нужно ли обязательно брать только из сетевого города ?
): Promise<PerformanceCurrent | null> => {
  const response = await getPerformanceCurrent(authData)

  if (!response.ok) {
    if (systemInitiator) return null
    // Возвращаем из базы
    return getPerformanceFromDB(authData)
  }

  const result = await response.json<PerformanceCurrent>()

  // Сохраняем в базе
  savePerformance(result, authData, systemInitiator)

  return result
}
