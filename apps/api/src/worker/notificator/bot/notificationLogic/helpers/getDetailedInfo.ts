import { Grade } from '@diary-spo/shared'
import { markValueGetById } from '../../../../../models/MarkValue/actions/get/markValueGetById'
import { requiredGetByData } from '../../../../../models/Required'
import { scheduleGetFromDBById } from '../../../../../models/Schedule'
import { subjectGetFromDBById } from '../../../../../models/Subject'
import { taskGetFromDB } from '../../../../../models/Task'
import type { EventDetailedInfo } from '../../../types/EventDetailedInfo'
import type { MarkEvent } from '../../../types/MarkEvent'

export const getDetailedInfo = async (
  event: MarkEvent
): Promise<EventDetailedInfo | null> => {
  const task = await taskGetFromDB(event.task.id)

  if (!task) return null

  const taskRequired = await requiredGetByData(event.diaryUserId, task.id)

  if (!taskRequired) return null

  const schedule = await scheduleGetFromDBById(task.scheduleId)

  if (!schedule || !schedule?.subjectId) return null

  const subject = await subjectGetFromDBById(schedule.subjectId)

  if (!subject) return null

  const previousMark = event.previousMarkId
    ? ((await markValueGetById(event.previousMarkId))?.value ?? null)
    : null

  const isCredit = event.mark === 'Two' && taskRequired.isRequired

  return {
    task,
    subject,
    schedule,
    previousMark: previousMark ? Grade[previousMark] : null,
    currentMark: isCredit ? 'Д' : Grade[event.mark],
    eventDatetime: event.eventDatetime,
    status: event.status
  }
}
