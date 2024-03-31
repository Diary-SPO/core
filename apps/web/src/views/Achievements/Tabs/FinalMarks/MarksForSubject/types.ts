import type { AcademicRecord } from '@diary-spo/shared'

export interface MarksForSubjectProps {
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
