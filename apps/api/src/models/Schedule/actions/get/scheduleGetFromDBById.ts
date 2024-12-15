import { ScheduleModel } from '../../model'

export const scheduleGetFromDBById = async (scheduleId: bigint) =>
  ScheduleModel.findOne({
    where: {
      id: scheduleId
    }
  })
