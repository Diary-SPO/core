import type { AdditionalMarks } from '@diary-spo/shared'
import type { IScheduleModel } from '../../../models/Schedule'
import type { ISubjectModelType } from '../../../models/Subject'
import type { ITaskModel } from '../../../models/Task'

export interface EventDetailedInfo {
  // Информация об источнике события
  subject: ISubjectModelType
  schedule: IScheduleModel
  task: ITaskModel
  // Информация об изменениях
  previousMark: AdditionalMarks | number | null
  currentMark: AdditionalMarks | number
  status: 'ADD' | 'DELETE' | 'UPDATE'
  // Доп. инфа
  eventDatetime: Date
}
