import { client } from '@db'
import { Lesson } from '@diary-spo/shared'
import createQueryBuilder from '@diary-spo/sql'
import { updateLessonType } from '../lessonType'
import { GradebookDB, Schedule } from '../types'
import { saveGradebook } from './save'

export const updateGradebook = async (schedule: Schedule, lesson: Lesson) => {
  const existGradebookQueryBuilder = createQueryBuilder<GradebookDB>(client)
    .select('*')
    .where(`"scheduleId" = ${schedule.id}`)
    .from('gradebook')

  let existGradebook: GradebookDB | null =
    await existGradebookQueryBuilder.first()

  if (!existGradebook) {
    existGradebook = await saveGradebook(schedule, lesson)
  } else {
    // Повторяется в gradebook/save. Нужно вынести
    if (!lesson.gradebook?.lessonType) {
      console.error(
        'Не удалось сохранить тип для gradebook при обновлении: отсутствует lessonType!'
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

    existGradebook =
      (
        await existGradebookQueryBuilder.update({
          lessonTypeId: lessonType.id
        })
      )?.[0] ?? null
  }

  // Дальше нужно обновить темы, задания, типы задания, обязательность заданий
}
