import { objPropertyCopy } from '@helpers'
import {
  ClassroomModel,
  ClassroomModelType,
  IClassroomModelType
} from '@models'
import { Optional } from 'sequelize'

export const saveClassroom = async (
  classroom: Optional<ClassroomModelType, 'id'>
): Promise<IClassroomModelType> =>
  ClassroomModel.findOrCreate({
    where: {
      idFromDiary: classroom.idFromDiary,
      spoId: classroom.spoId
    },
    defaults: {
      ...classroom
    }
  })
    .then((v) => {
      const result = v[0]
      if (v[1]) {
        return result
      }
      objPropertyCopy(result, classroom)
      return result.save()
    })
    .catch(async () =>
      saveClassroom(classroom).catch(() => {
        throw new Error('Ошибка сохранения Classroom')
      })
    )
