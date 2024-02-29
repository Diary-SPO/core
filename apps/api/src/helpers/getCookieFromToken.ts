import { ApiError } from '@api'
import {
  AuthModel,
  AuthModelType,
  DiaryUserModel,
  DiaryUserModelType
} from '@models'
import { caching } from 'cache-manager'

const memoryCache = await caching('memory', {
  max: 1000,
  ttl: 30 * 1000 /*milliseconds*/,
  refreshThreshold: 10 * 1000 /* как часто проверять в фоновом режиме */
})

type IUserAuthInfo = AuthModelType & { diaryUser: DiaryUserModelType }
export type ICacheData = {
  cookie: string
  idFromDiary: number
  localUserId: number
  groupId: number
}

/**
 * Возвращает куку при предъявлении токена
 * @param token
 * @returns {string} cookie
 */
export const getCookieFromToken = async (
  token: string
): Promise<ICacheData> => {
  const getCacheFromCookie = await cacheGetter(token)

  if (getCacheFromCookie) {
    return getCacheFromCookie
  }

  // TODO: сделать метод рядом с моделью для создания и использовать тут
  const DiaryUserAuth = (await AuthModel.findOne({
    where: {
      token
    },
    include: {
      model: DiaryUserModel,
      required: true
    }
    // TODO: fix it
  })) as IUserAuthInfo | null

  if (!DiaryUserAuth) {
    throw new ApiError('INVALID_TOKEN', 401)
  }

  const cookie = DiaryUserAuth.diaryUser.cookie
  const idFromDiary = DiaryUserAuth.diaryUser.idFromDiary
  const localUserId = DiaryUserAuth.idDiaryUser
  const groupId = DiaryUserAuth.diaryUser.groupId

  await memoryCache.set(token, { cookie, idFromDiary, localUserId, groupId })

  return { cookie, idFromDiary, localUserId, groupId }
}

/**
 * Возвращает куку, если она закеширована, или null, если она отсутствует
 * @param token
 * @returns {string} cookie
 * @returns {null}
 */
const cacheGetter = async (token: string): Promise<ICacheData | null> => {
  const cacheCookie = await memoryCache.get<ICacheData>(token)

  if (!cacheCookie) {
    return null
  }

  return cacheCookie
}
