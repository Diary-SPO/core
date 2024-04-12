import type { ICacheData } from '@helpers'
import { FinalMarkModel } from '../../model'

export const saveOrGetFinalMark = async (
  markValueId: number | null,
  subjectId: bigint,
  authData: ICacheData
) => {
  // why
  const where = {
    subjectId,
    diaryUserId: authData.localUserId
  }
  return FinalMarkModel.findOrCreate({
    // why
    where,
    defaults: {
      // why
      ...where,
      markValueId
    }
  })
}
