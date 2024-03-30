import { Nullable } from '@diary-spo/shared'

export interface ISummary {
  totalNumberOfMarks: Nullable<number>
  averageMark: Nullable<number>
  markCounts: Nullable<Record<number, number>>
}
