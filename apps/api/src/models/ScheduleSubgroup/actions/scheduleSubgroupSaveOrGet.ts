import { ScheduleSubgroupModel } from '@models'

export const scheduleSubgroupSaveOrGet = async (
  scheduleId: number,
  diaryUserId: number,
  subgroupId: number
) => {
  const where = {
    scheduleId,
    diaryUserId
  }
  const promise = ScheduleSubgroupModel.findOrCreate({
    where,
    defaults: {
      ...where,
      subgroupId
    }
  })

  promise.then((v) => {
    const result = v[0]
    if (v[1]) {
      return result
    }
    result.subgroupId = subgroupId
    return result.save()
  })

  return promise
}
