import { IMarksByDay } from '@components'
import { Grade, PerformanceCurrent } from '@diary-spo/shared'

/**
 * Функция 'extractMarksByDay' обрабатывает данные оценок, извлекая оценки по дням для каждого урока (пары).
 * Она проходит по performanceData, организуя оценки по дате и названию урока, преобразуя markValues в числовые оценки.
 * Перед сохранением оценок по дням и урокам убеждается в их числовой пригодности.
 * Функция возвращает структуру, содержащую оценки, организованные по дням для каждого урока.
 */

export const extractMarksByDay = (
  performanceData: PerformanceCurrent | null
): IMarksByDay => {
  const marksByDay: IMarksByDay = {}

  performanceData?.daysWithMarksForSubject?.forEach((subject) => {
    subject?.daysWithMarks?.forEach((markData) => {
      const day = new Date(markData.day).toLocaleDateString()
      const lessonName = subject.subjectName

      const validGrades = markData.markValues.filter(
        (gradeText) => Grade[gradeText] !== undefined
      )
      const grades = validGrades.map((gradeText) => Number(Grade[gradeText]))

      if (grades.length > 0) {
        if (!marksByDay[day]) {
          marksByDay[day] = {}
        }

        if (!marksByDay[day][lessonName]) {
          marksByDay[day][lessonName] = []
        }

        if (grades.every((grade) => !Number.isNaN(grade))) {
          marksByDay[day][lessonName].push(...grades)
        }
      }
    })
  })

  return marksByDay
}
