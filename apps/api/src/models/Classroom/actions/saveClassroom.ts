import { checkSameKeys } from '@helpers'
import { ClassroomModel, ClassroomModelType } from '@models'
import { Optional } from 'sequelize'
import { LogError } from 'src/LogError'

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
