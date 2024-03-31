import { ScheduleSubgroupModel } from '@models'

export const deleteScheduleSubgroup = async (
  scheduleId: number,
  diaryUserId: number
) => {
  return ScheduleSubgroupModel.destroy({
    where: {
      scheduleId,
      diaryUserId
    }
  })
}
