import { PerformanceCurrent } from 'diary-shared'
import { Grade, TextMark } from '../types'

export const formatStatisticsData = (marks: PerformanceCurrent) => {
  try {
    const allMarks: TextMark[] = marks.daysWithMarksForSubject.reduce(
      (marksArray: TextMark[], subject) => {
        if (subject.daysWithMarks) {
          subject.daysWithMarks.forEach((day) =>
            // @ts-ignore
            marksArray.push(...day.markValues)
          )
        }
        return marksArray
      },
      []
    )

    const totalNumberOfMarks: number = allMarks.length
    const totalSumOfMarks: number = allMarks.reduce(
      (sum, mark) => sum + (Grade[mark] as number),
      0
    )
    const averageMark: number = totalSumOfMarks / totalNumberOfMarks
    const markCounts: Record<number, number> = {
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    }

    allMarks.forEach((textMark: TextMark) => {
      const numericMark: number = Grade[textMark] as number
      if (numericMark >= 2 && numericMark <= 5) {
        markCounts[numericMark] += 1
      }
    })

    return {
      totalNumberOfMarks: totalNumberOfMarks.toString(),
      averageMark: Number(averageMark.toFixed(3)),
      markCounts,
    }
  } catch (e) {
    console.error(e)
    return null
  }
}
