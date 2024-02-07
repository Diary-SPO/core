import { Lesson } from '@diary-spo/shared'
import { updateLessonType } from '../lessonType'
import { GradebookModel, IGradebookModel, IScheduleModel } from 'src/services/models'

export const saveGradebook = async (
  schedule: IScheduleModel,
  lesson: Lesson
): Promise<IGradebookModel | null> => {
  if (!lesson.gradebook?.lessonType) {
    console.error(
      'Не удалось сохранить тип для gradebook: отсутствует lessonType!'
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

  return await GradebookModel.create({
    scheduleId: schedule.id,
    lessonTypeId: lessonType.id
  })
}
