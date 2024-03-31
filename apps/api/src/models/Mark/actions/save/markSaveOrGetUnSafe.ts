import type { ICacheData } from '@helpers'
import { MarkModel } from '@models'

export const markSaveOrGetUnSafe = async (
  markValueId: number,
  taskId: bigint,
  termId: bigint | null,
  authData: ICacheData
) => {
  const where = {
    taskId,
    diaryUserId: authData.localUserId
  }

  return MarkModel.findOrCreate({
    where,
    defaults: {
      ...where,
      markValueId,
      termId
    }
  })
}
