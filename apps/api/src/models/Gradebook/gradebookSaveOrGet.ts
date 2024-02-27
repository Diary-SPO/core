import { Gradebook } from '@diary-spo/shared'
import { LessonTypeSaveOrGet } from '../LessonType/lessonTypeSaveOrGet'
import { tasksSaveOrGet } from '../Task'
import { ThemesSaveOrGet } from '../Theme/themesSaveOrGet'
import {IUserInfo} from "../DiaryUser";
import {AbsenceTypeSaveOrGet} from "../AbsenceType";
import { GradebookModel } from './model';
import { ScheduleModel } from '../Schedule';

export const gradebookSaveOrGet = async (
  gradebook: Gradebook,
  userInfo: IUserInfo,
  lessonId?: number | null
) => {
  const lessonTypeId = (await LessonTypeSaveOrGet(gradebook.lessonType)).id
  const absenceTypeId = gradebook.absenceType
    ? (await AbsenceTypeSaveOrGet(gradebook.absenceType)).id
    : undefined

  const dataToSave = {
    lessonTypeId,
    absenceTypeId,
    idFromDiary: gradebook.id
  }

  const [record, isCreated] = await GradebookModel.findOrCreate({
    where: {
      idFromDiary: gradebook.id
    },
    defaults: {
      ...dataToSave
    }
  })

  if (!isCreated) {
    await record.update({
      ...dataToSave
    })
  }

  ThemesSaveOrGet(record.id, gradebook?.themes ?? []).catch(() =>
    console.log(`[${new Date().toISOString()}] => Ошибка сохранения тем`)
  )

  tasksSaveOrGet(record.id, gradebook?.tasks ?? [], userInfo).catch(() =>
    console.log(
      `[${new Date().toISOString()}] => Ошибка сохранения задач (тасков)`
    )
  )

  // Прикрепляем gradebook
  if (lessonId) {
    ScheduleModel.update(
      {
        gradebookId: record.id
      },
      {
        where: {
          id: lessonId
        }
      }
    )
  }

  return record
}
