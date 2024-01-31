import { Lesson } from '@diary-spo/shared'
import { updateLessonType } from '../lessonType'
import { GradebookDB, Schedule } from '../types'
import { saveGradebook } from './save'
import { GradebookModel } from 'src/services/models'

export const updateGradebook = async (schedule: Schedule, lesson: Lesson) => {
  /*const existGradebookQueryBuilder = createQueryBuilder<GradebookDB>(client)
    .select('*')
    .where(`"scheduleId" = ${schedule.id}`)
    .from('gradebook')*/

  let existGradebook: GradebookDB | null =
    await GradebookModel.findOne({
      where: {
        scheduleId: schedule.id
      }
    }) as unknown as GradebookDB

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

    existGradebook = existGradebook.update({
      lessonTypeId: lessonType.id
    })
  }

  // Дальше нужно обновить темы, задания, типы задания, обязательность заданий
}
