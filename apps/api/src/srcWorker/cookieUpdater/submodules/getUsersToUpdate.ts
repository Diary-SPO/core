import { DiaryUserModel, IDiaryUserModel } from '@db'
import { formatDate } from '@utils'
import { Op } from 'sequelize'
import { MAX_NOT_UPDATE_TOKEN_IN_DAYS } from '../config'
import { maxDateInactive } from './maxDateInactive'

export const getUsersToUpdate = async (): Promise<IDiaryUserModel[] | null> => {
  // 1. Получаем конечную дату
  const maxDate = maxDateInactive(MAX_NOT_UPDATE_TOKEN_IN_DAYS)

  // 2. Получаем список пользователей для обновления
  const users = await DiaryUserModel.findAll({
    where: {
      cookieLastDateUpdate: {
        [Op.lt]: formatDate(maxDate.toISOString())
      }
    }
  })

  return users
}
