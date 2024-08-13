import { API_ERRORS, UnauthorizedError } from '@api'
import { KEY } from '@config'
import type { ResponseLogin, With } from '@diary-spo/shared'
import { generateToken } from '@helpers'

import {
  DiaryUserModel,
  type IDiaryUserModel,
  getFormattedDiaryUserData
} from '../../../../models/DiaryUser'
import { GroupModel, type IGroupModel } from '../../../../models/Group'
import { type ISPOModel, SPOModel } from '../../../../models/SPO'

type DiaryUserAuthInfoWithGroup = With<
  IDiaryUserModel,
  {
    group: IGroupModel & {
      spo: ISPOModel
    }
  }
>

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
  // @TODO fixme
  const diaryUserRecord: DiaryUserAuthInfoWithGroup | null =
    await DiaryUserModel.findOne({
      where: {
        login,
        password: KEY.encrypt(password)
      },
      include: [
        {
          model: GroupModel,
          required: true,
          include: [
            {
              model: SPOModel,
              required: true
            }
          ]
        }
      ]
    })

  if (!diaryUserRecord) {
    throw new UnauthorizedError(API_ERRORS.USER_NOT_FOUND)
  }

  const groupData = diaryUserRecord.group
  const spoData = groupData.spo

  // Если пользователь найден, генерируем токен и отдаём
  const token = await generateToken(diaryUserRecord.id)

  return getFormattedDiaryUserData(diaryUserRecord, spoData, groupData, token)
}
