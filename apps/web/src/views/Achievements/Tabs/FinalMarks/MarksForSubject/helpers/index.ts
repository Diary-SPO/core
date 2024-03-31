import { type AcademicRecord, Grade, type MarkKeys } from '@diary-spo/shared'
import type { SubjectData, SubjectMatrix, Term, TermMark } from '../types.ts'

/**
 * Получает корректную оценку
 */
// TODO: add tests
export const getMark = (value: MarkKeys): TermMark => {
  const grade = Grade[value]

  if (grade === 'Д') {
    return
  }

  return grade || ''
}

/**
 * Преобразует данные для рендера в таблице
 */
export const buildSubjectMatrix = (data: AcademicRecord): SubjectMatrix => {
  const subjectMatrix: SubjectMatrix = []

  for (const subject of data.subjects) {
    const subjectData: SubjectData = {
      subjectName: subject.name,
      terms: [],
      finalMark: getMark(subject.finalMark.value) || ''
    }

    for (const year of data.academicYears) {
      for (const term of year.terms) {
        const mark = subject.marks[term.id]

        const termData: Term = {
          course: year.number,
          semester: term.number,
          mark: mark ? getMark(mark.value) || '.' : ''
        }

        subjectData.terms.push(termData)
      }
    }

    subjectMatrix.push(subjectData)
  }

  return subjectMatrix
}
