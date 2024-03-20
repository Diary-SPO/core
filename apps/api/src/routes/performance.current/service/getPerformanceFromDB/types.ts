import { MarkKeys } from "@diary-spo/shared";
import { IMarkModelType, IMarkValueModelType, IScheduleModel, ISubjectModelType, ITaskModel } from "@models";

export type IPerformanceFromDB = ISubjectModelType & {
  schedules: IScheduleFull[]
}

type IScheduleFull = IScheduleModel & {
  tasks: ITaskFull[]
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