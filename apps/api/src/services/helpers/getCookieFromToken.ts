import { ApiError } from '@api'
import { caching } from 'cache-manager'
import {
  AuthModel,
  DiaryUserModel,
  AuthModelType,
  DiaryUserModelType
} from '../models'

const memoryCache = await caching('memory', {
  max: 1000,
  ttl: 30 * 1000 /*milliseconds*/,
  refreshThreshold: 10 * 1000 /* как часто проверять в фоновом режиме */
})

type IUserAuthInfo = AuthModelType & { diaryUser: DiaryUserModelType }
type ICacheData = {
  cookie: string
  idFromDiary: number
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

  const DiaryUserAuth = (await AuthModel.findOne({
    where: {
      token
    },
    include: {
      model: DiaryUserModel,
      required: true
    }
  })) as IUserAuthInfo | null

  if (!DiaryUserAuth) {
    throw new ApiError('INVALID_TOKEN', 401)
  }

  const cookie = DiaryUserAuth.diaryUser.cookie
  const idFromDiary = DiaryUserAuth.diaryUser.idFromDiary

  await memoryCache.set(token, { cookie, idFromDiary })

  return { cookie, idFromDiary }
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
