import { TeacherModel, TeacherModelType } from '@models'
import { Optional } from 'sequelize'
import { LogError } from 'src/LogError'

export const TeacherSaveOrGet = async (
  teacher: Optional<TeacherModelType, 'id'>
): Promise<TeacherModelType> =>
  TeacherModel.findOrCreate({
    where: {
      spoId: teacher.spoId,
      idFromDiary: teacher.idFromDiary
    },
    defaults: {
      ...teacher
    }
  }).then((v) => {
    const result = v[0]
    if (v[1]) {
      return result
    }
    return result.update({ ...teacher })
  })
