import type { Day } from '@diary-spo/shared'
import { type ICacheData, retriesForError } from '@helpers'
import { type IScheduleModel, deleteOldDays, lessonSave } from '@models'
import type { ITermDetectP } from '@models'

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
    const promise = retriesForError(
      lessonSave,
      [new Date(day.date), lesson, authData, termPromise],
      3,
      1000
    ) //lessonSave(day.date, lesson, authData, termPromise)
    // Сохраняем промис, чтобы дождаться массового завершения
    promises.push(promise)
  }

  // По завершению всех промисов - удаляем старое расписание
  Promise.all(promises).then((v) => deleteOldDays(v, authData))
}
