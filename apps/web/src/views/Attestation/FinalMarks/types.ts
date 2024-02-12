export interface TableProps {
  subjectMatrix: SubjectMatrix
  uniqueKeys: string[]
}

export interface SubjectMatrix {
  [subjectName: string]: Record<string, string>
}
