import type { PerformanceCurrent } from '@diary-spo/shared'
import type { ICacheData } from '@helpers'
import { createDiaryClient } from 'src/services/DiaryClientService'

export const getPerformanceCurrent = async (
  authData: ICacheData
): Promise<PerformanceCurrent | null> => {
  try {
    return await createDiaryClient(authData).getPerformance()
  } catch {
    return null
  }
}
