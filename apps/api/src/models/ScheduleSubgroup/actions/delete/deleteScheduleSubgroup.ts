import { ScheduleSubgroupModel } from '@models'

export const deleteScheduleSubgroup = async (
  scheduleId: bigint,
  diaryUserId: bigint
) => {
  return ScheduleSubgroupModel.destroy({
    where: {
      scheduleId,
      diaryUserId
    }
  })
}
