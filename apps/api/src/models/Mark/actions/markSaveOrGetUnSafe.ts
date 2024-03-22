import { ICacheData } from '@helpers'
import { MarkModel } from '@models'

export const markSaveOrGetUnSafe = async (
  markValueId: number,
  taskId: number,
  termId: number | null,
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
