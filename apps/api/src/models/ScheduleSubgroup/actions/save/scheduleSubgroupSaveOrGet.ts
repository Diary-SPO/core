import { ScheduleSubgroupModel } from '@models'
import { Op } from 'sequelize'

export const scheduleSubgroupSaveOrGet = async (
  scheduleId: bigint,
  diaryUserId: bigint,
  subgroupId: bigint
) => {
  const where = {
    scheduleId,
    diaryUserId,
    subgroupId: {
      [Op.ne]: null
    }
  }
  const promise = ScheduleSubgroupModel.findOrCreate({
    where,
    defaults: {
      ...where,
      subgroupId
    }
  })

  promise.then(async (v) => {
    const result = v[0]
    if (v[1]) {
      return result
    }
    result.subgroupId = subgroupId
    return result.save()
  })

  return promise
}
