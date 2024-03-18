import { IMarkValuePerformanceResourceParam, IMarkValuePerformanceResourceReturn } from "./types";

export const markValuePerformance = (
  param: IMarkValuePerformanceResourceParam
): IMarkValuePerformanceResourceReturn => {
  return param.value
}