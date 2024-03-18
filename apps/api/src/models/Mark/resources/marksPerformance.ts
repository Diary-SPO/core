import { markValuePerformance } from "src/models/MarkValue";
import { IMarkPerformanceResourceParam, IMarkPerformanceResourceReturn } from "./types";

export const marksPerformance = (
  param: IMarkPerformanceResourceParam
): IMarkPerformanceResourceReturn => {
  return markValuePerformance(param.markValue)
}