import { AcademicRecord } from '@diary-spo/shared'
import { SubjectMatrix } from './types.ts'

export const buildSubjectMatrix = (data: AcademicRecord): SubjectMatrix => {
  const subjectMatrix: SubjectMatrix = {}

  data.subjects.forEach((subject) => {
    subjectMatrix[subject.name] = {}
    data.academicYears.forEach((year) => {
      year.terms.forEach((term) => {
        const key = `${year.number} курс\n${
          term.number === 1 ? '1 сем.' : '2 сем.'
        }`

        if (!subjectMatrix[subject.name][key]) {
          subjectMatrix[subject.name][key] = subject.marks[term.id.toString()]
            ? subject.marks[term.id.toString()]?.value || '.'
            : ''
        }
      })
    })
    subjectMatrix[subject.name].ИТОГ = subject.finalMark.value || ''
  })

  return subjectMatrix
}

export const collectUniqueKeys = (subjectMatrix: SubjectMatrix): string[] => {
  return Array.from(
    new Set(
      Object.keys(subjectMatrix).flatMap((subjectName) =>
        Object.keys(subjectMatrix[subjectName])
      )
    )
  )
}
