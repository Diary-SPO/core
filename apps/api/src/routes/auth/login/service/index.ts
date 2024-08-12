import { API_ERRORS, UnauthorizedError } from '@api'
import { KEY } from '@config'
import type { ResponseLogin } from '@diary-spo/shared'
import { generateToken } from '@helpers'

import {
  DiaryUserModel,
  type IDiaryUserModel
} from '../../../../models/DiaryUser'
import { GroupModel, type IGroupModel } from '../../../../models/Group'
import { type ISPOModel, SPOModel } from '../../../../models/SPO'
import { ResponseLoginFromDiaryUser } from '../../../../types'

type DiaryUserAuthInfo = IDiaryUserModel & {
  group: IGroupModel & {
    spo: ISPOModel
  }
}

/**
 * Оффлайн авторизация через базу данных.
 * Срабатывает в случае если оригинальный дневник упал и пользователь есть в базе данных.
 * @param login
 * @param password
 * @returns {ResponseLogin}
 */
export const offlineAuth = async (
  login: string,
  password: string
): Promise<ResponseLogin | null> => {
  /** Пробуем войти "оффлайн", если пользователь есть в базе (в случае, если упал основной дневник) **/
  const diaryUserRecord = (await DiaryUserModel.findOne({
    where: {
      login,
      password: KEY.encrypt(password)
    },
    include: {
      model: GroupModel,
      required: true,
      include: [
        {
          model: SPOModel,
          required: true
        }
      ]
    }
    // TODO: fix it
  })) as DiaryUserAuthInfo

  if (!diaryUserRecord) {
    throw new UnauthorizedError(API_ERRORS.USER_NOT_FOUND)
  }

  const groupData = diaryUserRecord.group
  const spoData = groupData.spo

  // Если пользователь найден, генерируем токен и отдаём
  const token = await generateToken(diaryUserRecord.id)

  return ResponseLoginFromDiaryUser(
    diaryUserRecord,
    spoData,
    // TODO: fix it
    groupData as IGroupModel, // Т.к. выше нахимичили свой тип, то явно указываем то, что ожидается
    token
  )
}
