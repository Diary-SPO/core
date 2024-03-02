import { ScheduleSubgroupModel } from '@models'
import { Op } from 'sequelize'

export const deleteScheduleSubgroup = async (
  scheduleId: number,
  diaryUserId: number
) => {
  return ScheduleSubgroupModel.destroy({
    where: {
      [Op.and]: [
        {
          scheduleId,
          diaryUserId
        }
      ]
    }
  })
}
