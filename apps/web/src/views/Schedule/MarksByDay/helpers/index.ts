import { Day } from '@diary-spo/shared'
import { MarkDetailed } from '../types.ts'

export const transformData = (
  lessonsState: Day[]
): [string, MarkDetailed[]][] => {
  if (!lessonsState || !lessonsState?.length) {
    return []
  }

  const resultMap = new Map<string, MarkDetailed[]>()

  lessonsState.forEach((lessonDay) => {
    const day = new Date(lessonDay.date).toLocaleDateString('ru')

    lessonDay.lessons?.forEach((lesson) => {
      if (!lesson.name || !lesson.gradebook) {
        return
      }

      const existingTasks = resultMap.get(day) || []

      lesson.gradebook.tasks.forEach((newTask) => {
        if (
          !existingTasks.some(
            (existingTask) => existingTask.task.id === newTask.id
          )
        ) {
          existingTasks.push({ lessonName: lesson.name, task: newTask })
        }
      })

      resultMap.set(day, existingTasks)
    })
  })

  return Array.from(resultMap.entries())
}
