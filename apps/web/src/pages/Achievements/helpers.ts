import {
  Grade,
  type MarkKeys,
  type PerformanceCurrent
} from '@diary-spo/shared'

/**
 * Функция 'formatStatisticsData' обрабатывает данные оценок, вычисляя статистику на их основе.
 * Извлекает все оценки из 'marks' и вычисляет общее количество, общую сумму оценок и среднюю оценку.
 * Вычисляет количество оценок каждой из категорий (от 2 до 5).
 * Возвращает объект, содержащий общее количество оценок, среднюю оценку и количество оценок для каждой категории.
 * В случае возникновения ошибки, выводит ошибку в консоль и возвращает null.
 */

export const formatStatisticsData = (marks: PerformanceCurrent) => {
  const allMarks: MarkKeys[] = marks.daysWithMarksForSubject.reduce(
    (marksArray: MarkKeys[], subject) => {
      if (subject.daysWithMarks) {
        for (const day of subject.daysWithMarks) {
          marksArray.push(...day.markValues)
        }
      }
      return marksArray
    },
    []
  )

  const totalNumberOfMarks: number = allMarks.length
  const totalSumOfMarks: number = allMarks.reduce(
    (sum, mark) => sum + Number(Grade[mark]),
    0
  )
  const averageMark: number = totalSumOfMarks / totalNumberOfMarks
  const markCounts: Record<number, number> = {
    2: 0,
    3: 0,
    4: 0,
    5: 0
  }

  for (const textMark of allMarks) {
    const numericMark = Number(Grade[textMark])
    if (numericMark >= 2 && numericMark <= 5) {
      markCounts[numericMark] += 1
    }
  }

  return {
    totalNumberOfMarks,
    averageMark: Number(averageMark.toFixed(3)),
    markCounts
  }
}
