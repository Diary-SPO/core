import { ScheduleSubgroupModel } from '@models'

export const scheduleSubgroupSaveOrGet = async (
  scheduleId: number,
  diaryUserId: number,
  subgroupId: number
) => {
  const where = {
    scheduleId,
    diaryUserId,
    subgroupId
  }
  const promise = ScheduleSubgroupModel.findOrCreate({
    where,
    defaults: where
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
