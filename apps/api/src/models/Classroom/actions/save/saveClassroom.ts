import { objPropertyCopy } from '@helpers'
import {
  ClassroomModel,
  type ClassroomModelType,
  type IClassroomModelType
} from '@models'
import type { Optional } from 'sequelize'

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
  }).then((v) => {
    const result = v[0]
    if (v[1]) {
      return result
    }
    objPropertyCopy(result, classroom)
    return result.save()
  })
