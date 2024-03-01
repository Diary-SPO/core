import { LogError } from 'src/LogError'
import { ScheduleSubgroupModel } from './model'

export const scheduleSubgroupSafeSave = async (
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
    throw new LogError(
      `Ошибка сохранения ScheduleSubgroup. Входные данные: ${JSON.stringify(
        where
      )}`
    )
  })

  return record
}
