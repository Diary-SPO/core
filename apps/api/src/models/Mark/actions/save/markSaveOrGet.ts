import type { MarkKeys } from '@diary-spo/shared'
import { type ICacheData, retriesForError } from '@helpers'
import { type IScheduleModel, markValueSaveOrGet } from '@models'
import { formatDate } from '@utils'
import { markSaveOrGetUnSafe } from './markSaveOrGetUnSafe'

export const markSaveOrGet = async (
  mark: MarkKeys,
  schedule: IScheduleModel,
  taskId: bigint,
  termId: bigint | null,
  authData: ICacheData
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

  // Если есть изменения, то он потом сохранит
  markDB[0].markValueId = markValueId
  if (termId) {
    markDB[0].termId = termId
  }

  return markDB[0].save()
}
