import { Gradebook } from '@diary-spo/shared'
import { GradebookModel } from '../models'
import { AbsenceTypeSaveOrGet } from './absenceType'
import { IUserInfo } from './diaryUser'
import { LessonTypeSaveOrGet } from './lessonType'
import { TasksSaveOrGet } from './task'
import { ThemesSaveOrGet } from './theme'

export const GradebookSaveOrGet = async (
  gradebook: Gradebook,
  userInfo: IUserInfo
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

  TasksSaveOrGet(record.id, gradebook?.tasks ?? [], userInfo).catch(() =>
    console.log(
      `[${new Date().toISOString()}] => Ошибка сохранения задач (тасков)`
    )
  )

  return record
}
