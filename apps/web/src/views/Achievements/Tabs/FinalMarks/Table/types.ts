import { AcademicRecord, Nullable } from '@diary-spo/shared'

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
