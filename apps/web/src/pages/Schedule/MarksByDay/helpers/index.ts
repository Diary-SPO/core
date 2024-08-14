import type { Day } from '@diary-spo/shared'
import type { MarkDetailed } from '../types.ts'

export type MarksByDayMap = [string, MarkDetailed[]][]

export const transformData = (lessonsState: Day[]): MarksByDayMap => {
  if (!lessonsState || !lessonsState?.length) {
    return []
  }

  const resultMap = new Map<string, MarkDetailed[]>()

  for (const lessonDay of lessonsState) {
    const day = new Date(lessonDay.date).toLocaleDateString('ru')

    if (!lessonDay.lessons) {
      continue
    }

    for (const lesson of lessonDay.lessons) {
      if (!lesson.name || !lesson.gradebook) {
        continue
      }

      const existingTasks = resultMap.get(day) || []

      for (const newTask of lesson.gradebook.tasks) {
        if (
          !existingTasks.some(
            (existingTask) => existingTask.task.id === newTask.id
          )
        ) {
          existingTasks.push({ lessonName: lesson.name, task: newTask })
        }
      }

      resultMap.set(day, existingTasks)
    }
  }

  return Array.from(resultMap.entries())
}
