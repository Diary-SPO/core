import { API_ERRORS, NotFoundError, UnknownError } from '@api'
import { SERVER_URL } from '@config'
import { b64 } from '@diary-spo/crypto'
import type { ResponseLogin, UserData } from '@diary-spo/shared'

import { offlineAuth } from './service'
import { handleResponse } from './service/helpers'
import { saveUserData } from './service/save'
import { fetcher } from 'src/utils/fetcher'

interface AuthContext {
  login: string
  password: string
  isHash: boolean
}

const postAuth = async ({
  login,
  password,
  isHash
}: AuthContext): Promise<ResponseLogin> => {
  /** Если пароль передан в исходном виде, то хешируем его на сервере **/
  if (!isHash) {
    password = await b64(password)
  }

  const rawResponse = await fetcher.post(`${SERVER_URL}/services/security/login`, {
    json: { login, password, isRemember: true }
  })

  const res = await rawResponse.json<UserData>()

  const parsedRes = handleResponse(res)

  switch (parsedRes) {
    /** Авторизация через нашу БД **/
    case 'DOWN': {
      const authData = await offlineAuth(login, password)

      if (!authData) {
        throw new NotFoundError(API_ERRORS.USER_NOT_FOUND)
      }

      return authData
    }
    /** Неизвестная ошибка **/
    case 'UNKNOWN':
      throw new UnknownError('Unknown auth error')
    /** Сервер вернул корректные данные, сохраняем их в БД **/
    default: {
      /**
       * Если сетевой город поменял тип своего ответа, то мы бы хотели об этом узнать
       * Поэтому проверяем хотя бы наличие одного обязательного поля
       **/

      const setCookieHeader = rawResponse.headers.get('Set-Cookie')

      if (!parsedRes.tenants || !setCookieHeader) {
        throw new UnknownError(`Unreachable auth error${parsedRes}`)
      }

      const userData = await saveUserData(
        parsedRes,
        login,
        password,
        setCookieHeader
      )

      if (!userData) {
        throw new UnknownError('Unreachable auth error')
      }

      return userData
    }
  }
}

export default postAuth
