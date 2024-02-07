import { IScheduleModel, ScheduleModel } from '@db'
import { formatDate } from '@utils'
import { DBSchedule } from '../../../types/databaseTypes'

export const updateSchedule = async (
  schedule: DBSchedule
): Promise<IScheduleModel | null> => {
  // Проверяем входные параметры
  if (schedule?.id) {
    console.error(
      'Хоть тип DBSchedule и допускает свойство id, но оно не должно быть передано при сохранении или обновлении!'
    )
    return null
  }

  const scheduleExist = await ScheduleModel.findOne({
    where: {
      subjectName: schedule.subjectName,
      date: formatDate(schedule.date),
      startTime: schedule.startTime,
      endTime: schedule.endTime
    }
  })

  if (scheduleExist) {
    await scheduleExist.update({
      ...schedule
    })
    return scheduleExist
  }

  return ScheduleModel.create({ ...schedule })
}
