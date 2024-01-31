import { client } from '@db'
import createQueryBuilder from '@diary-spo/sql'
import { formatDate } from '@utils'
import { DBSchedule } from '../../../types/databaseTypes'
import { protectInjection } from '../../../utils/protectInjection'

export const updateSchedule = async (
  schedule: DBSchedule
): Promise<DBSchedule | null> => {
  // Проверяем входные параметры
  if (schedule?.id) {
    console.error(
      'Хоть тип DBSchedule и допускает свойство id, но оно не должно быть передано при сохранении или обновлении!'
    )
    return
  }

  const existingQueryBuilder = createQueryBuilder<DBSchedule>(client)
    .select('*')
    .from('schedule')
    .where(
      `"subjectName" = '${protectInjection(schedule.subjectName)}'` +
        ` and date = '${protectInjection(formatDate(schedule.date))}'` +
        ` and "startTime" = '${protectInjection(schedule.startTime)}'` +
        ` and "endTime" = '${protectInjection(schedule.endTime)}'`
    )

  const scheduleExist = await existingQueryBuilder.first()

  if (scheduleExist) {
    await existingQueryBuilder
      .where(`id = ${scheduleExist.id}`)
      .update(schedule)
    return scheduleExist
  }

  return (await existingQueryBuilder.insert(schedule))?.[0] ?? null
}
