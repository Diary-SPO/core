import type { ICacheData } from '@helpers'
import { MarkModel } from '../../model'

export const markDelete = async (taskId: bigint, authData: ICacheData) =>
  MarkModel.destroy({
    where: {
      taskId,
      diaryUserId: authData.localUserId
    }
  })
