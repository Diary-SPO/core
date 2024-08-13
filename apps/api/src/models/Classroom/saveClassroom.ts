import type { Optional } from 'sequelize'
import { LogError } from 'src/LogError'
import { checkSameKeys } from '../../helpers'
import { ClassroomModel, type ClassroomModelType } from './model'

export const saveClassroom = async (
  classroom: Optional<ClassroomModelType, 'id'>
) => {
  const [record, isCreated] = await ClassroomModel.findOrCreate({
    where: {
      idFromDiary: classroom.idFromDiary,
      spoId: classroom.spoId
    },
    defaults: {
      ...classroom
    }
  }).catch(() => {
    throw new LogError(
      `Ошибка сохранения Classroom. Входные данные: ${JSON.stringify(
        classroom
      )}`
    )
  })

  if (!isCreated && !checkSameKeys(classroom, record)) {
    return await record.update({
      ...classroom
    })
  }

  return record
}
