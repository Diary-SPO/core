import { MarkKeys } from "@diary-spo/shared"
import {  IMarkPerformanceResourceParam, ITaskTypeModel } from "@models"

export type ITaskMarksPerformanceResourceReturn = MarkKeys[]
export type ITaskMarksPerformanceResourceParam = ITaskTypeModel & {
  marks: IMarkPerformanceResourceParam[]
}