import type { MarkKeys, Task } from '@diary-spo/shared'
import { type ICacheData, retriesForError } from '@helpers'
import { formatDate } from '@utils'
import { addNewMarkEvent } from '../../../../worker/notificator/bot'
import { markValueSaveOrGet } from '../../../MarkValue'
import type { IScheduleModel } from '../../../Schedule'
import { markSaveOrGetUnSafe } from './markSaveOrGetUnSafe'

export const markSaveOrGet = async (
  mark: MarkKeys,
  schedule: IScheduleModel,
  taskId: bigint,
  termId: bigint | null,
  authData: ICacheData,
  task: Task | null,
  systemInitiator = false
) => {
  // Не сохраняем текущий семестр для предыдущих семестров
  if (authData.termStartDate && authData.termLastUpdate) {
    const scheduleDate = formatDate(new Date(schedule.date).toISOString())
    const minDate = formatDate(new Date(authData.termStartDate).toISOString())
    const currDate = formatDate(new Date().toISOString())
    const lastUpdate = formatDate(
      new Date(authData.termLastUpdate).toISOString()
    )

    termId = minDate <= scheduleDate && currDate === lastUpdate ? termId : null
  } else {
    termId = null
  }

  const markValueId = (await retriesForError(markValueSaveOrGet, [mark])).id

  const markDB = await retriesForError(markSaveOrGetUnSafe, [
    markValueId,
    taskId,
    termId,
    authData
  ])

  const previousMarkId = markDB[0].markValueId

  // Если есть изменения, то он потом сохранит
  markDB[0].markValueId = markValueId
  if (termId) {
    markDB[0].termId = termId
  }

  // Сохраняем событие добавления/обновления оценки
  if (task && systemInitiator)
    if (markDB[0].markValueId !== previousMarkId || markDB[1])
      addNewMarkEvent({
        mark,
        previousMarkId:
          markDB[0].markValueId !== previousMarkId ? previousMarkId : null,
        task,
        diaryUserId: authData.localUserId,
        status: markDB[1] ? 'ADD' : 'UPDATE',
        eventDatetime: new Date()
      })

  return markDB[0].save()
}
