import { DiaryUserModel, DiaryUserModelType, IDiaryUserModel } from '@models'
import { Optional } from 'sequelize'
// ВЫНЕСТИ В МОДЕЛЬ юзера

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
