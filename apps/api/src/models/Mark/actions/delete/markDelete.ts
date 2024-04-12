import type { ICacheData } from '@helpers'
import { MarkModel } from '@models'

export const markDelete = async (taskId: bigint, authData: ICacheData) =>
  MarkModel.destroy({
    where: {
      taskId,
      diaryUserId: authData.localUserId
    }
  })
