import type { Day, Lesson, MarkKeys, Task } from '@diary-spo/shared'
import { isApiError, toISODate } from '../../../../shared'
import { getUserLessons } from '../../../../shared/api'

export interface ResolvedLesson {
  task: Task | null
  lessonIndex: number
  startTime?: string
  endTime?: string
}

export const parseRuDate = (value: string): Date | null => {
  const [day, month, year] = value.split('.').map(Number)
  if (!day || !month || !year) return null
  return new Date(year, month - 1, day)
}

export const readCachedDays = (): Day[] | null => {
  try {
    const raw = localStorage.getItem('savedLessons')
    if (!raw) return null
    const parsed = JSON.parse(raw) as Day[]
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

const isFullLesson = (
  lesson: Lesson
): lesson is Extract<Lesson, { name: unknown }> =>
  'name' in lesson && typeof lesson.name === 'string' && lesson.name.length > 0

const norm = (value: string): string => value.trim().toLowerCase()

export const findLessons = (
  days: Day[],
  date: Date,
  subjectName: string
): Array<{
  lesson: Extract<Lesson, { name: unknown }>
  lessonIndex: number
}> => {
  const wanted = toISODate(date)
  const target = norm(subjectName)
  const found: Array<{
    lesson: Extract<Lesson, { name: unknown }>
    lessonIndex: number
  }> = []

  for (const day of days) {
    if (toISODate(new Date(day.date)) !== wanted) continue
    day.lessons?.forEach((lesson, lessonIndex) => {
      if (!isFullLesson(lesson)) return
      const name = norm(lesson.name ?? '')
      if (name === target || name.includes(target) || target.includes(name)) {
        found.push({ lesson, lessonIndex })
      }
    })
  }

  return found
}

export const pickTask = (
  lessons: Array<{ lesson: Extract<Lesson, { name: unknown }> }>,
  markIndex: number,
  markKey: MarkKeys | null
): ResolvedLesson | null => {
  const entry = lessons[markIndex] ?? lessons[0]
  if (!entry) return null

  const tasks = entry.lesson.gradebook?.tasks ?? []
  const task =
    (markKey && tasks.find((item) => item.mark === markKey)) ??
    tasks.find((item) => item.mark) ??
    tasks[0] ??
    null

  return {
    task,
    lessonIndex: 0,
    startTime: entry.lesson.startTime,
    endTime: entry.lesson.endTime
  }
}

export const resolveLesson = (
  days: Day[] | null,
  date: Date,
  subjectName: string,
  markIndex: number,
  markKey: MarkKeys | null
): (ResolvedLesson & { dateISO: string }) | null => {
  if (!days) return null
  const lessons = findLessons(days, date, subjectName)
  if (!lessons.length) return null

  const entry = lessons[markIndex] ?? lessons[0]
  const picked = pickTask([entry], 0, markKey)
  if (!picked) return null

  return { ...picked, lessonIndex: entry.lessonIndex, dateISO: toISODate(date) }
}

const withTimeout = <T>(task: Promise<T>, ms: number): Promise<T | null> =>
  Promise.race([
    task,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms))
  ])

const requestRange = async (from: Date, to: Date): Promise<Day[] | null> => {
  try {
    const response = await withTimeout(getUserLessons(from, to), 8000)
    if (!response || isApiError(response) || !response.data) return null
    return response.data
  } catch {
    return null
  }
}

export const fetchDaysForDate = async (date: Date): Promise<Day[] | null> => {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return null
  return requestRange(date, date)
}
