import { Optional } from 'sequelize'
import { checkSameKeys } from '../helpers/checkDataForObject'
import { TeacherModel, TeacherModelType } from '@db'

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
    throw new Error(
      `[${new Date().toISOString()}] => Ошибка сохранения Teacher. Входные данные: ${JSON.stringify(
        teacher
      )}`
    )
  })

  if (!isCreated && !checkSameKeys(teacher, record)) {
    return await record.update({
      ...teacher
    })
  }

  return record
}
