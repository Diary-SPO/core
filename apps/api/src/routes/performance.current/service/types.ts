import type { MarkKeys } from '@diary-spo/shared'
import type { IAbsenceModel } from '../../../models/Absence'
import type { IAbsenceTypeModel } from '../../../models/AbsenceType'
import type { IMarkModelType } from '../../../models/Mark'
import type { IMarkValueModelType } from '../../../models/MarkValue'
import type { IScheduleModel } from '../../../models/Schedule'
import type { ScheduleSubgroupModelType } from '../../../models/ScheduleSubgroup'
import type { ISubjectModelType } from '../../../models/Subject'
import type { ITaskModel } from '../../../models/Task'

export type IPerformanceFromDB = ISubjectModelType & {
  schedules: IScheduleFull[]
}

type IScheduleFull = IScheduleModel & {
  tasks: ITaskFull[]
  absences: Array<
    IAbsenceModel & {
      absenceType: IAbsenceTypeModel
    }
  >
  scheduleSubgroups: ScheduleSubgroupModelType[]
}

type ITaskFull = ITaskModel & {
  marks: IMarkFull[]
}

type IMarkFull = IMarkModelType & {
  markValue: IMarkValueModelType
}

export type IMonthWithDay = {
  month: {
    num: number
    name: string
  }
  daysWithLessons: (string | Date)[]
}

export type IDayWithMarks = {
  day: string | Date
  markValues: MarkKeys[]
  absenceType?: string
}

export const monthNames: string[] = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь'
]
