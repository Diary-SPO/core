import { ScheduleSubgroupModel } from "../models/scheduleSubgroup"

export const ScheduleSubgroupSafeSave = async (
  scheduleId: number,
  diaryUserId: number,
  subgroupId: number
) => {
  const where = {
    scheduleId: scheduleId,
    diaryUserId: diaryUserId,
    subgroupId: subgroupId
  }

  const [record] = await ScheduleSubgroupModel.findOrCreate({
    where: {
      scheduleId: scheduleId,
      diaryUserId: diaryUserId,
      subgroupId: subgroupId
    },
    defaults: {
      scheduleId: scheduleId,
      diaryUserId: diaryUserId,
      subgroupId: subgroupId
    }
  }).catch(() => {
    throw new Error(`[${new Date().toISOString()}] => Ошибка сохранения ScheduleSubgroup. Входные данные: ${JSON.stringify(where)}`)
  })

  return record
}