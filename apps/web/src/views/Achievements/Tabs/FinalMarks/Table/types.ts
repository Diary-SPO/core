import type { AcademicRecord } from '@diary-spo/shared'
import type { Nullable } from '@types'

export type Cell = Nullable<{
  row: number
  col: number
}>

export interface TableProps {
  data: AcademicRecord
}

export type TermMark = 'Зч' | '.' | '' | number

export interface Term {
  course: number
  semester: number
  mark: TermMark
}

export interface SubjectData {
  subjectName: string
  terms: Term[]
  finalMark: TermMark
}

export type SubjectMatrix = Array<SubjectData>
