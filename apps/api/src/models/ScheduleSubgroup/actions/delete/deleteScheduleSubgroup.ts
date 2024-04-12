import { ScheduleSubgroupModel } from '@models'

export const deleteScheduleSubgroup = async (
  scheduleId: bigint,
  diaryUserId: bigint
) =>
  ScheduleSubgroupModel.destroy({
    where: {
      scheduleId,
      diaryUserId
    }
  })
