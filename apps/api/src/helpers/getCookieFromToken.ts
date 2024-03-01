import { ApiError } from '@api'
import {
  AuthModel,
  AuthModelType,
  DiaryUserModel,
  DiaryUserModelType,
  GroupModel,
  GroupModelType,
  SPOModel,
  SPOModelType
} from '@models'
import { caching } from 'cache-manager'

const memoryCache = await caching('memory', {
  max: 1000,
  ttl: 30 * 1000 /*milliseconds*/,
  refreshThreshold: 10 * 1000 /* как часто проверять в фоновом режиме */
})

type IUserAuthInfo = AuthModelType & {
  diaryUser: DiaryUserModelType & {
    group: GroupModelType & {
      spo: SPOModelType
    }
  }
}
export type ICacheData = {
  cookie: string
  idFromDiary: number
  localUserId: number
  groupId: number
  spoId: number
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
      required: true,
      include: [
        {
          model: GroupModel,
          required: true,
          include: [{
            model: SPOModel,
            required: true
          }]
        }
      ]
    }
    // TODO: fix it
  })) as IUserAuthInfo | null

  if (!DiaryUserAuth) {
    throw new ApiError('INVALID_TOKEN', 401)
  }

  const cookie = DiaryUserAuth.diaryUser.cookie
  const idFromDiary = DiaryUserAuth.diaryUser.idFromDiary
  const localUserId = DiaryUserAuth.diaryUserId
  const groupId = DiaryUserAuth.diaryUser.groupId
  const spoId = DiaryUserAuth.diaryUser.group.spo.id
  const toSave = { cookie, idFromDiary, localUserId, groupId, spoId }

  await memoryCache.set(token, toSave)

  return { ...toSave }
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
