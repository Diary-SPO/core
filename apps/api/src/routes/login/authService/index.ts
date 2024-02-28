import { API_CODES, ApiError } from '@api'
import { ENCRYPT_KEY } from '@config'
import { encrypt } from '@diary-spo/sql'
import { ResponseLogin } from '@diary-spo/types'
import {
  DiaryUserModel,
  GroupModel,
  IDiaryUserModel,
  IGroupModel,
  ISPOModel,
  SPOModel
} from '@models'
import { ResponseLoginFromDiaryUser } from '@types'
import { generateToken } from '../../../helpers'

type DiaryUserAuthInfo = IDiaryUserModel & {
  group: IGroupModel & {
    SPO: ISPOModel
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
      password: encrypt(password, ENCRYPT_KEY)
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
    throw new ApiError(
      'User not found or incorrect password!',
      API_CODES.NOT_FOUND
    )
  }

  const groupData = diaryUserRecord.group
  const spoData = groupData.SPO

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
