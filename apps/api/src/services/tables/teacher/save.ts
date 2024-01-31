import { client } from '@db'
import type { Teacher } from '@diary-spo/shared'
import createQueryBuilder from '@diary-spo/sql'
import { DBTeacher } from '../../../types/databaseTypes'
import { protectInjection } from '../../../utils/protectInjection'
export const saveTeacher = async (
  teacher: Teacher,
  spoId: number
): Promise<DBTeacher> => {
  const getTeacherQueryBuilder = createQueryBuilder<DBTeacher>(client)
    .select('*')
    .from('teacher')
    .where(
      `"firstName" = '${protectInjection(teacher.firstName)}'` +
        ` and "lastName" = '${protectInjection(teacher.lastName)}'` +
        ` and "middleName" = '${protectInjection(teacher.middleName)}'`
    )

  const teacherExist: DBTeacher | null = await getTeacherQueryBuilder.first()

  if (teacherExist) {
    return teacherExist
  }

  // Если учителя нет в базе, то вставляем в базу и возвращаем вставленную запись.
  // Id не передаём, т.к. он от id в оригинальном дневнике, а у нас используется свой.
  return (
    (
      await getTeacherQueryBuilder.insert({
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        middleName: teacher.middleName,
        spoId
      })
    )?.[0] ?? null
  )
}
