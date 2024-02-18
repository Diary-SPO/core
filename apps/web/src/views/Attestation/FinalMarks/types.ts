export type TermMark = 'Зч' | '.' | '' | number

export interface Term {
  course: number
  semester: number
  mark: TermMark
}

export interface SubjectData {
  subjectName: string
  terms: Term[]
  finalMark: string | number
}

export interface SubjectMatrix extends Array<SubjectData> {}
