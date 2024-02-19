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

export type Nullable<T> = T | null

export type Cell = Nullable<{
  row: number
  col: number
}>

export interface TableProps {
  subjectMatrix: SubjectMatrix
}
