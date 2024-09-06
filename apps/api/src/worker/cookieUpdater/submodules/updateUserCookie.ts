import { SERVER_URL } from '@config'
import type { UserData } from '@diary-spo/shared'
import { cookieExtractor, formatDate } from '@utils'
import ky from 'ky'
import type { IDiaryUserModel } from '../../../models/DiaryUser'
import { logger } from '../../utils/logger'

const log = logger('cookie updater')

export const updateUserCookie = async (
  user: IDiaryUserModel
): Promise<void> => {
  const userInfo = `'${user.login}' [${user.id}]`
  console.log('Обновляю cookie пользователя', userInfo)

  // 1. Авторизируемся
  const rawResponse = await ky.post(`${SERVER_URL}/services/security/login`, {
    body: JSON.stringify({
      login: user.login,
      password: user.password,
      isRemember: true
    }),
    timeout: 10000 // 10 seconds
  })

  const res = rawResponse.ok
    ? await rawResponse.json<UserData>()
    : rawResponse.status

  // Если дневник вернул что-то другое...
  if (typeof res === 'number') {
    log('WORKER: Что-то не так... Дневник ответил чем-то другим ?')
    return
  }

  // 2. Подготавливаем куку
  const setCookieHeader = rawResponse.headers.get('Set-Cookie')
  const cookie = cookieExtractor(setCookieHeader ?? '')

  // 3. Обновляем куку и дату обновления
  user
    .update({
      cookie,
      cookieLastDateUpdate: formatDate(new Date().toISOString())
    })
    .then(() => {
      console.log('Успешно обновил в базе для', userInfo)
    })
    .catch((err) => {
      console.error(
        'Ошибка обновления в базе для',
        userInfo,
        'Подробнее:',
        err.toISOString()
      )
    })
}
