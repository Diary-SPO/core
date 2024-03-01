import { Day } from '@diary-spo/shared'
import { ICacheData } from '@helpers'
import { IScheduleModel } from '@models'
import { deleteOld } from './deleteOld'
import { lessonSave } from './lessonSave'

export const ScheduleSave = async (day: Day, authData: ICacheData) => {
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
  Promise.all(promises).then((v) => deleteOld(v, authData))
}
