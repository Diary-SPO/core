import {
  DiaryUserModel,
  type DiaryUserModelType,
  type IDiaryUserModel
} from '@models'
import type { Optional } from 'sequelize'

export const saveOrGetDiaryUser = async (
  data: Optional<DiaryUserModelType, 'id'>
): Promise<IDiaryUserModel> => {
  const [record, isCreat] = await DiaryUserModel.findOrCreate({
    where: {
      login: data.login
    },
    defaults: {
      ...data
    }
  })

  if (!isCreat) {
    // Без await, т.к. обновляем "в фоне"
    record.update({
      ...data,
      isAdmin: record.isAdmin
    })
  }

  return record
}
