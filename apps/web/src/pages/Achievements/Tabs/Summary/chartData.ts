import {
  Grade,
  type MarkKeys,
  type PerformanceCurrent
} from '@diary-spo/shared'

export interface SubjectAverage {
  name: string
  average: number
}

export interface TrendPoint {
  key: string
  label: string
  average: number
  count: number
}

const toNumeric = (mark: MarkKeys): number | null => {
  const value = Grade[mark]
  return typeof value === 'number' ? value : null
}

const parseDate = (value: Date | string): Date | null => {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const dayKey = (date: Date): string => date.toISOString().slice(0, 10)

const shortLabel = (date: Date): string =>
  date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short'
  })

/** Понедельник недели (локальная дата). */
const weekStart = (date: Date): Date => {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const day = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - day)
  return d
}

interface DayBucket {
  date: Date
  sum: number
  count: number
}

/** Собирает суммы оценок по календарным дням. */
const collectDayBuckets = (
  marks: PerformanceCurrent | null
): DayBucket[] => {
  if (!marks) return []

  const byDay = new Map<string, DayBucket>()

  for (const subject of marks.daysWithMarksForSubject) {
    for (const day of subject.daysWithMarks ?? []) {
      const date = parseDate(day.day)
      if (!date) continue

      const nums = day.markValues
        .map(toNumeric)
        .filter((n): n is number => n != null)
      if (!nums.length) continue

      const key = dayKey(date)
      const current = byDay.get(key) ?? { date, sum: 0, count: 0 }
      current.sum += nums.reduce((a, b) => a + b, 0)
      current.count += nums.length
      byDay.set(key, current)
    }
  }

  return [...byDay.values()].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  )
}

/** Накопительный средний: как менялся общий балл с начала периода. */
export const buildCumulativeTrend = (
  marks: PerformanceCurrent | null
): TrendPoint[] => {
  const days = collectDayBuckets(marks)
  let sum = 0
  let count = 0

  return days.map((day) => {
    sum += day.sum
    count += day.count
    return {
      key: dayKey(day.date),
      label: shortLabel(day.date),
      average: Number((sum / count).toFixed(2)),
      count
    }
  })
}

/** Средний балл по учебным неделям — меньше точек, без дневного шума. */
export const buildWeeklyTrend = (
  marks: PerformanceCurrent | null
): TrendPoint[] => {
  const days = collectDayBuckets(marks)
  const byWeek = new Map<string, { date: Date; sum: number; count: number }>()

  for (const day of days) {
    const start = weekStart(day.date)
    const key = dayKey(start)
    const current = byWeek.get(key) ?? { date: start, sum: 0, count: 0 }
    current.sum += day.sum
    current.count += day.count
    byWeek.set(key, current)
  }

  return [...byWeek.values()]
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((week) => ({
      key: dayKey(week.date),
      label: shortLabel(week.date),
      average: Number((week.sum / week.count).toFixed(2)),
      count: week.count
    }))
}

/** Средние по дисциплинам, только числовые, по убыванию. */
export const buildSubjectAverages = (
  marks: PerformanceCurrent | null
): SubjectAverage[] => {
  if (!marks) return []

  return marks.daysWithMarksForSubject
    .map((subject) => {
      const average = toNumeric(subject.averageMark)
      if (average == null) return null
      return { name: subject.subjectName, average }
    })
    .filter((item): item is SubjectAverage => item != null)
    .sort((a, b) => b.average - a.average)
}

export const MARK_COLORS: Record<2 | 3 | 4 | 5, string> = {
  5: '#56ab2f',
  4: '#8bc34a',
  3: '#e56d1f',
  2: '#ff416c'
}
