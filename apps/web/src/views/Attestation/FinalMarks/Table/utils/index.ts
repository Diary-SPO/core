import { AcademicRecord, Grade, MarkKeys } from '@diary-spo/shared'
import { SubjectData, SubjectMatrix, Term, TermMark } from '../types.ts'

/**
 * Стили для таблицы
 */
const bgColor = 'rgba(240,240,240,0.05)'

export const cellStyle = (isSelected: boolean, isHovered: boolean) => ({
  padding: '10px',
  border: '1px solid #ddd',
  backgroundColor: isSelected ? bgColor : isHovered ? bgColor : 'inherit'
})

/**
 * Получает корректную оценку
 */
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
