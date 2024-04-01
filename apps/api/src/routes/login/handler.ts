import { API_ERRORS, NotFoundError, UnknownError } from '@api'
import { SERVER_URL } from '@config'
import { b64 } from '@diary-spo/crypto'
import type { ResponseLogin, UserData } from '@diary-spo/shared'
import { fetcher } from '@utils'
import type { Context } from 'elysia'
import { offlineAuth } from './service'
import { handleResponse } from './service/helpers'
import { saveUserData } from './service/save'

interface AuthContext extends Context {
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
    password = await b64(body.password)
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
    default:
      /**
       * Если сетевой город поменял тип своего ответа, то мы бы хотели об этом узнать
       * Поэтому проверяем хотя бы наличие одного обязательного поля
       **/
      if (!parsedRes.data.tenants) {
        throw new UnknownError('Unreachable auth error')
      }

      return saveUserData(parsedRes, login, password)
  }
}

export default postAuth
