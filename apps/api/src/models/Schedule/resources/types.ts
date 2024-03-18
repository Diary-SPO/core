import { IScheduleModel, ITaskMarksPerformanceResourceParam, ITaskMarksPerformanceResourceReturn } from "@models"

export type IScheduleMarksPerformanceResourceReturn = {
  day: string | Date
  markValues: ITaskMarksPerformanceResourceReturn
}
export type IScheduleMarksPerformanceResourceParam = IScheduleModel & {
  tasks: ITaskMarksPerformanceResourceParam[]
}