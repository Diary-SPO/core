import { TeacherModel } from '@db'
import type { Teacher } from '@diary-spo/shared'
import { DBTeacher } from '../../../types/databaseTypes'
export const saveTeacher = async (
  teacher: Teacher,
  spoId: number
): Promise<DBTeacher> => {
  const teacherExist: DBTeacher | null = await TeacherModel.findOne({
    where: {
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      middleName: teacher.middleName
    }
  }) as unknown as DBTeacher

  if (teacherExist) {
    return teacherExist
  }

  // Если учителя нет в базе, то вставляем в базу и возвращаем вставленную запись.
  // Id не передаём, т.к. он от id в оригинальном дневнике, а у нас используется свой.
  return await TeacherModel.create({
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    middleName: teacher.middleName,
    spoId
  }) as unknown as DBTeacher
}
