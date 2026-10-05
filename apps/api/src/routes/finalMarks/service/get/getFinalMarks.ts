import type { AcademicRecord } from '@diary-spo/shared'
import type { ICacheData } from '@helpers'
import { createDiaryClient } from 'src/services/DiaryClientService'

export const getFinalMarksFromDiary = async (authData: ICacheData) => {
  return createDiaryClient(authData)
    .getFinalMarks()
    .then((response): AcademicRecord => response)
    .catch(() => null)
}
