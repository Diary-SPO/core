import { DiaryUserModel } from '@db'
import { Lesson } from '@diary-spo/shared'
import { getOrSaveTeacher } from './getOrSaveTeacget'

export const saveLesson = async (
  lesson: Lesson,
  userId: number
): Promise<void> => {
  const user = await DiaryUserModel.findOne({
    where: {
      idFromDiary: userId
    }
  })

  if (!user) {
    console.log(`Пользователь с ${userId} не найден`)
    return
  }

  const teacherData = lesson.timetable?.teacher
  const teacher = teacherData
    ? getOrSaveTeacher({
        firstName: teacherData.firstName,
        lastName: teacherData.lastName,
        middleName: teacherData.middleName,
        spoId: 1,
        idFromDiary: teacherData.id
      })
    : null
}
