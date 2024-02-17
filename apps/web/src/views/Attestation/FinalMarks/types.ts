export interface Term {
  course: number
  semester: number
  mark: string
}

export interface SubjectData {
  subjectName: string
  terms: Term[]
  finalMark: string
}

export interface SubjectMatrix extends Array<SubjectData> {}
