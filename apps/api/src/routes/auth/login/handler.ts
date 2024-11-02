import { API_ERRORS, NotFoundError, UnknownError } from '@api'
import { SERVER_URL } from '@config'
import { b64 } from '@diary-spo/crypto'
import type { ResponseLogin, UserData } from '@diary-spo/shared'

import { fetcher } from 'src/utils/fetcher'
import { offlineAuth } from './service'
import { saveUserData } from './service/save'

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

  try {
    const rawResponse = await fetcher.post(
      `${SERVER_URL}/services/security/login`,
      {
        json: { login, password, isRemember: true }
      }
    )

    /**
     * Если сетевой город поменял тип своего ответа, то мы бы хотели об этом узнать
     * Поэтому проверяем хотя бы наличие одного обязательного поля
     **/

    const setCookieHeader = rawResponse.headers.get('Set-Cookie')

    const parsedRes = await rawResponse.json<UserData>()

    if (!parsedRes.tenants || !setCookieHeader) {
      throw new UnknownError(`Unreachable auth error${parsedRes}`)
    }

    const userData = await saveUserData(
      parsedRes,
      login.toLowerCase(),
      password,
      setCookieHeader
    )

    if (!userData) {
      throw new UnknownError('Unreachable auth error')
    }

    return userData
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e))

    const authData = await offlineAuth(login, password)

    if (!authData) {
      throw new NotFoundError(API_ERRORS.USER_NOT_FOUND)
    }

    return authData
  }
}

export default postAuth
