import type { Day } from '@diary-spo/shared'
import { type ICacheData, retriesForError } from '@helpers'
import type { ITermDetectP } from '../../../Term'
import type { IScheduleModel } from '../../model'
import { deleteOldDays } from '../delete'
import { lessonSave } from './lessonSave'

export const daySave = async (
  day: Day,
  authData: ICacheData,
  termPromise?: ITermDetectP,
  systemInitiator = false
) => {
  if (!day.lessons) {
    return
  }

  const promises: Promise<IScheduleModel | null>[] = []

  for (const lesson of day.lessons) {
    const promise = retriesForError(
      lessonSave,
      [new Date(day.date), lesson, authData, termPromise, systemInitiator],
      3,
      1000
    ) //lessonSave(day.date, lesson, authData, termPromise)
    // Сохраняем промис, чтобы дождаться массового завершения
    promises.push(promise)
  }

  // По завершению всех промисов - удаляем старое расписание
  Promise.all(promises).then((v) => deleteOldDays(v, authData))
}
