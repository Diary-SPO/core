import { Lesson } from '@diary-spo/shared'
import {
  GradebookModel,
  IGradebookModel,
  IScheduleModel
} from 'src/services/models'
import { updateLessonType } from '../lessonType'
import { saveGradebook } from './save'

export const updateGradebook = async (
  schedule: IScheduleModel,
  lesson: Lesson
) => {
  const existGradebook: IGradebookModel | null = await GradebookModel.findOne({
    where: {
      scheduleId: schedule.id
    }
  })

  if (!existGradebook) {
    /*existGradebook =*/ await saveGradebook(schedule, lesson)
  } else {
    // Повторяется в gradebook/save. Нужно вынести
    if (!lesson.gradebook?.lessonType) {
      console.error(
        'Не удалось сохранить тип для gradebook при обновлении: отсутствует lessonType!'
      )
      return null
    }

    const lessonType = await updateLessonType(
      lesson.gradebook.lessonType.toString()
    )

    if (!lessonType) {
      console.error('Не удалось сохранить lessonType!')
      return null
    }

    // Зачем-то сохраняли раньше... Возможно для дальнейшей обработки. Пока-что уберу, чтобы не жаловался на отсутствие await
    /*existGradebook =*/ existGradebook.update({
      lessonTypeId: lessonType.id
    })
  }

  // Дальше нужно обновить темы, задания, типы задания, обязательность заданий
}
