import { ITaskMarksPerformanceResourceReturn, taskMarksPerformance } from "src/models/Task";
import { IScheduleMarksPerformanceResourceParam, IScheduleMarksPerformanceResourceReturn } from "./types";

export const scheduleMarksPerformance = (
  param: IScheduleMarksPerformanceResourceParam
): IScheduleMarksPerformanceResourceReturn => {
  const marksValue: ITaskMarksPerformanceResourceReturn = []

  for (const task of param.tasks) {
    marksValue.push(...taskMarksPerformance(task))
  }

  return {
    day: param.date,
    markValues: marksValue
  }
}