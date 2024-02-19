import { AcademicRecord } from '@diary-spo/shared'
import { getMark } from './helpers.ts'
import { SubjectData, SubjectMatrix, Term } from './types.ts'

export const buildSubjectMatrix = (data: AcademicRecord): SubjectMatrix => {
  const subjectMatrix: SubjectMatrix = []

  data.subjects.forEach((subject) => {
    const subjectData: SubjectData = {
      subjectName: subject.name,
      terms: [],
      finalMark: getMark(subject.finalMark.value) || ''
    }

    data.academicYears.forEach((year) => {
      year.terms.forEach((term) => {
        const mark = subject.marks[term.id]

        const termData: Term = {
          course: year.number,
          semester: term.number,
          mark: mark ? getMark(mark?.value) || '.' : ''
        }

        subjectData.terms.push(termData)
      })
    })
    subjectMatrix.push(subjectData)
  })

  return subjectMatrix
}
