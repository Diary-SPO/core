import { AcademicRecord, Grade } from '@diary-spo/shared'
import { SubjectData, SubjectMatrix, Term } from './types.ts'

export const buildSubjectMatrix = (data: AcademicRecord): SubjectMatrix => {
  const subjectMatrix: SubjectMatrix = []

  data.subjects.forEach((subject) => {
    const subjectData: SubjectData = {
      subjectName: subject.name,
      terms: [],
      finalMark: Grade[subject.finalMark.value] || ''
    }
    data.academicYears.forEach((year) => {
      year.terms.forEach((term) => {
        const mark = subject.marks[term.id.toString()]
        const termData: Term = {
          course: year.number,
          semester: term.number,
          mark: mark ? Grade[mark?.value] || '.' : ''
        }
        subjectData.terms.push(termData)
      })
    })
    subjectMatrix.push(subjectData)
  })

  return subjectMatrix
}
