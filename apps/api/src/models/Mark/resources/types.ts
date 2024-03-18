import { MarkKeys } from "@diary-spo/shared"
import { IMarkModelType, IMarkValuePerformanceResourceParam } from "@models"

export type IMarkPerformanceResourceReturn = MarkKeys
export type IMarkPerformanceResourceParam = IMarkModelType & {
  markValue: IMarkValuePerformanceResourceParam
}