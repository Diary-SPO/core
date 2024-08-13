import { checkSameKeys } from '@helpers'
import { TeacherModel, type TeacherModelType } from '@models'
import type { Optional } from 'sequelize'
import { LogError } from 'src/LogError'

export const TeacherSaveOrGet = async (
  teacher: Optional<TeacherModelType, 'id'>
) => {
  const [record, isCreated] = await TeacherModel.findOrCreate({
    where: {
      spoId: teacher.spoId,
      idFromDiary: teacher.idFromDiary
    },
    defaults: {
      ...teacher
    }
  }).catch(() => {
    throw new LogError(
      `Ошибка сохранения Teacher. Входные данные: ${JSON.stringify(teacher)}`
    )
  })

  if (!isCreated && !checkSameKeys(teacher, record)) {
    return await record.update({
      ...teacher
    })
  }

  return record
}
