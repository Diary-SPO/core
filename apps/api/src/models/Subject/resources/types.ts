import { IScheduleMarksPerformanceResourceParam, IScheduleMarksPerformanceResourceReturn, ISubjectModelType } from "@models"

export type ISubjectsMarksPerformanceResourceReturn = {
  subjectName: string
  daysWithMarks: IScheduleMarksPerformanceResourceReturn[]
}
export type ISubjectsMarksPerformanceResourceParam = ISubjectModelType & {
  schedules: IScheduleMarksPerformanceResourceParam[]
}