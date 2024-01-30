import { client } from '@db'
import { Lesson } from '@diary-spo/shared'
import createQueryBuilder from '@diary-spo/sql'
import { updateLessonType } from '../lessonType'
import { GradebookDB, Schedule } from '../types'

export const saveGradebook = async (
  schedule: Schedule,
  lesson: Lesson
): Promise<GradebookDB | null> => {
  if (!lesson.gradebook?.lessonType) {
    console.error(
      'Не удалось сохранить тип для gradebook: отсутствует lessonType!'
    )
    return
  }

  const lessonType = await updateLessonType(
    lesson.gradebook.lessonType.toString()
  )

  if (!lessonType) {
    console.error('Не удалось сохранить lessonType!')
    return
  }

  return (
    (
      await createQueryBuilder<GradebookDB>(client).from('gradebook').insert({
        scheduleId: schedule.id,
        lessonTypeId: lessonType.id
      })
    )?.[0] ?? null
  )
}
