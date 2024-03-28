import { TeacherModel, TeacherModelType } from '@models'
import { Op, Optional } from 'sequelize'
import { LogError } from 'src/LogError'

export const TeacherSaveOrGet = async (
  teacher: Optional<TeacherModelType, 'id' | 'idFromDiary'> &
    Omit<TeacherModelType, 'id' | 'idFromDiary'>
): Promise<TeacherModelType> => {
  // TODO: что-то как-т острашно стало. Лучше
  // сделать две разные функции - одна по id
  // будет искать/сохранять, а другая
  // чисто spoId + names
  return TeacherModel.findOrCreate({
    // @ts-ignore
    where: {
      spoId: teacher.spoId,
      [Op.or]: [
        {
          [Op.and]: [
            {
              idFromDiary: teacher.idFromDiary ?? null
            },
            {
              idFromDiary: {
                [Op.not]: null
              }
            }
          ]
        },
        {
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          middleName: teacher.middleName ?? null
        }
      ]
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
}
