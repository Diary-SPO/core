import { API_CODES, ApiError } from '@api'
import { ENCRYPT_KEY } from '@config'
import { DiaryUserModel, GroupsModel, SPOModel, generateToken } from '@db'
import { encrypt } from '@diary-spo/sql'
import { type ResponseLogin } from '@diary-spo/types'
import { ResponseLoginFromDiaryUser } from '@types'

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
  const diaryUserRecord = await DiaryUserModel.findOne({
    where: {
      login,
      password: encrypt(password, ENCRYPT_KEY)
    },
    include: {
      model: GroupsModel,
      required: true,
      include: [
        {
          model: SPOModel,
          required: true
        }
      ]
    }
  })

  if (!diaryUserRecord) {
    throw new ApiError(
      'User not found or incorrect password!',
      API_CODES.NOT_FOUND
    )
  }

  //console.log(diaryUserRecord.dataValues.group.dataValues.SPO.dataValues.abbreviation)

  const diaryUserData = diaryUserRecord.dataValues
  const groupData = diaryUserData.group.dataValues
  const spoData = groupData.SPO.dataValues

  // Если пользователь найден, генерируем токен и отдаём
  diaryUserData.token = await generateToken(diaryUserData.id)

  return ResponseLoginFromDiaryUser(diaryUserData, groupData, spoData)
}
