import { Op } from "sequelize"
import { ScheduleSubgroupModel } from "../model"

export const deleteScheduleSubgroup = async (
  scheduleId: number,
  diaryUserId: number
) => {
  return ScheduleSubgroupModel.destroy({
    where :{
      [Op.and]: [
        {
          scheduleId,
          diaryUserId
        }
      ]
    }
  })
}