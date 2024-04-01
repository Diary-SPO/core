import type { ICacheData } from '@helpers'
import { RequiredModel } from '@models'

export const requiredSaveOrGet = async (
  isRequired: boolean,
  taskId: bigint,
  authData: ICacheData
) => {
  const where = {
    taskId,
    diaryUserId: authData.localUserId
  }

  return RequiredModel.findOrCreate({
    where,
    defaults: {
      ...where,
      isRequired
    }
  }).then((v) => {
    const result = v[0]
    if (v[1]) {
      return result
    }
    return result.update({
      isRequired
    })
  })
}
