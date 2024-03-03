import { API_CODES, API_ERRORS, ApiError } from '@api'
import { SERVER_URL } from '@config'
import type { UserData } from '@diary-spo/shared'
import { ResponseLogin } from '@diary-spo/types'
import { fetcher } from '@utils'
import Hashes from 'jshashes'
import { LogError } from 'src/LogError'
import { offlineAuth } from './authService'
import { handleResponse } from './authService/helpers'
import { saveUserData } from './authService/saveUserData'

interface AuthContext {
  body: {
    login: string
    password: string
    isHash: boolean
  }
}

const postAuth = async ({ body }: AuthContext): Promise<ResponseLogin> => {
  let { login, password, isHash } = body

  /** Если пароль передан в исходном виде, то хешируем его на сервере **/
  if (!isHash) {
    password = new Hashes.SHA256().b64(body.password)
  }

  const res = await fetcher<UserData>({
    url: `${SERVER_URL}/services/security/login`,
    method: 'POST',
    body: JSON.stringify({ login, password, isRemember: true })
  })

  const parsedRes = handleResponse(res)

  switch (parsedRes) {
    /** Авторизация через нашу БД **/
    case 'DOWN': {
      try {
        const authData = await offlineAuth(login, password)

        if (!authData) {
          throw new ApiError(
            API_ERRORS.USER_NOT_FOUND,
            API_CODES.INTERNAL_SERVER_ERROR
          )
        }

        return authData
      } catch (e) {
        throw new LogError(
          `Authorization error: access to the diary was denied, and authorization through the database failed. Full: ${e}`
        )
      }
    }
    /** Неизвестная ошибка **/
    case 'UNKNOWN':
      throw new ApiError('Unknown auth error', API_CODES.UNKNOWN_ERROR)
    /** Сервер выернул корректные данные, сохраняем их в БД **/
    default:
      /**
       * Если сетевой город поменял тип своего ответа, то мы бы хотели об этом узнать
       * Поэтому проверяем хотя бы наличие одного обязательного поля
       **/
      if (!parsedRes.data.tenants) {
        throw new ApiError('Unreachable auth error', API_CODES.UNKNOWN_ERROR)
      }

      return saveUserData(parsedRes, login, password)
  }
}

export default postAuth
