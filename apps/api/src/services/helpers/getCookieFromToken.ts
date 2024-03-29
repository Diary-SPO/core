import { ApiError } from '@api'
import { caching } from 'cache-manager'
import { AuthModel, DiaryUserModel } from '../models'

const memoryCache = await caching('memory', {
  max: 1000,
  ttl: 30 * 1000 /*milliseconds*/,
  refreshThreshold: 10 * 1000 /* как часто проверять в фоновом режиме */
})

/**
 * Возвращает куку при предъявлении токена
 * @param token
 * @returns {string} cookie
 */
export const getCookieFromToken = async (token: string): Promise<string> => {
  const getCacheFromCookie = await cacheGetter(token)

  if (getCacheFromCookie) {
    return getCacheFromCookie
  }

  const DiaryUserAuth = await AuthModel.findOne({
    where: {
      token
    },
    include: {
      model: DiaryUserModel,
      required: true
    }
  })

  if (!DiaryUserAuth) {
    throw new ApiError('INVALID_TOKEN', 401)
  }

  const cookie = DiaryUserAuth.diaryUser.cookie

  await memoryCache.set(token, cookie)

  return cookie
}

/**
 * Возвращает куку, если она закеширована, или null, если она отсутствует
 * @param token
 * @returns {string} cookie
 * @returns {null}
 */
const cacheGetter = async (token: string): Promise<string | null> => {
  const cacheCookie = await memoryCache.get<string>(token)

  if (!cacheCookie) {
    return null
  }

  return cacheCookie
}
