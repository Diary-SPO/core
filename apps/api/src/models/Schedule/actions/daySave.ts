import { Day } from '@diary-spo/shared'
import { ICacheData } from '@helpers'
import { IScheduleModel } from '@models'
import { deleteOldDays } from './deleteOldDays'
import { lessonSave } from './lessonSave'

export const daySave = async (day: Day, authData: ICacheData) => {
  if (!day.lessons) {
    return
  }

  const promises: Promise<IScheduleModel | null>[] = []

  for (const lesson of day.lessons) {
    const promise = lessonSave(day.date, lesson, authData)
    // Сохраняем промис, чтобы дождаться массового завершения
    promises.push(promise)
  }

  // По завершению всех промисов - удаляем старое расписание
  Promise.all(promises).then((v) => deleteOldDays(v, authData))
}
