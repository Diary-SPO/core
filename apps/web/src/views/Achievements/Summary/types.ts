import { Nullable } from '@types'

export interface ISummary {
  totalNumberOfMarks: Nullable<number>
  averageMark: Nullable<number>
  markCounts: Nullable<Record<number, number>>
}
