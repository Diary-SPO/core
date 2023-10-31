import { Grade, PerformanceCurrent } from 'diary-shared'
import { IMarksByDay } from '../../components/UI/MarksByDay'

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
      const grades = markData.markValues.map((gradeText) =>
        Number(Grade[gradeText])
      )
      const lessonName = subject.subjectName

      if (
        grades.length > 0 &&
        grades.every((grade) => !Number.isNaN(parseFloat(String(grade))))
      ) {
        if (!marksByDay[day]) {
          marksByDay[day] = {}
        }

        if (!marksByDay[day][lessonName]) {
          marksByDay[day][lessonName] = []
        }

        marksByDay[day][lessonName] = [
          ...marksByDay[day][lessonName],
          ...grades,
        ]
      }
    })
  })

  return marksByDay
}
