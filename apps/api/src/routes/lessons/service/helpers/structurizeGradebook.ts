import type { Gradebook, Task } from '@diary-spo/shared'
import type { ScheduleFromDB } from '@models'

export const structurizeGradebook = (
  rd: ScheduleFromDB
): Gradebook | undefined => {
  if (rd.gradebookIdFromDiary) {
    const id = rd.gradebookIdFromDiary
    const lessonType = rd.lessonType.name
    // Подготавливаем таски
    const tasks: Task[] = rd.tasks?.map((t) => {
      const { idFromDiary: id, topic } = t
      const type = t.taskType.name
      const isRequired = t.requireds?.[0].isRequired ?? false
      const mark = t.marks?.[0].markValue.value ?? undefined
      return {
        id,
        topic,
        type,
        isRequired,
        mark,
        attachments: []
      }
    })

    // Подготавливае темы
    const themes = rd.themes?.map((t) => t.description)

    const absenceType = rd.absences?.[0]?.absenceType.name ?? undefined

    return {
      id,
      lessonType,
      tasks,
      themes,
      absenceType
    }
  }

  return undefined
}
