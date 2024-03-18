import { marksPerformance } from "@models";
import { ITaskMarksPerformanceResourceParam, ITaskMarksPerformanceResourceReturn } from "./types";

export const taskMarksPerformance = (
  param: ITaskMarksPerformanceResourceParam
): ITaskMarksPerformanceResourceReturn => {
  const marksValue: ITaskMarksPerformanceResourceReturn = []
  for (const markModel of param.marks) {
    marksValue.push(marksPerformance(markModel))
  }
  return marksValue
}