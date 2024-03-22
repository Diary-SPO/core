import { Day } from '@diary-spo/shared'
import { ICacheData } from '@helpers'
import { IScheduleModel, deleteOldDays, lessonSave } from '@models'
import { ITermDetectP } from '@models'

export const daySave = async (
  day: Day,
  authData: ICacheData,
  termPromise?: ITermDetectP
) => {
  if (!day.lessons) {
    return
  }

  const promises: Promise<IScheduleModel | null>[] = []

  for (const lesson of day.lessons) {
    const promise = lessonSave(day.date, lesson, authData, termPromise)
    // Сохраняем промис, чтобы дождаться массового завершения
    promises.push(promise)
  }

  // По завершению всех промисов - удаляем старое расписание
  Promise.all(promises).then((v) => deleteOldDays(v, authData))
}
