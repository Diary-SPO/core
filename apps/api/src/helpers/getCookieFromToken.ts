import { API_ERRORS, ApiError } from '@api'
import type { Nullable } from '@diary-spo/shared'
import { caching } from 'cache-manager'
import {
  AuthModel,
  type AuthModelType,
  DiaryUserModel,
  type DiaryUserModelType,
  GroupModel,
  type GroupModelType,
  SPOModel,
  type SPOModelType
} from '../models'

const memoryCache = await caching('memory', {
  max: 1000,
  ttl: 60 * 1000 /*milliseconds*/,
  refreshThreshold: 30 * 1000 /* как часто проверять в фоновом режиме */
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
  localUserId: bigint
  groupId: bigint
  spoId: bigint
  token: string
  firstName: string
  lastName: string
  middleName?: string
  termLastUpdate?: Nullable<string>
  termStartDate?: Nullable<string>
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
          include: [
            {
              model: SPOModel,
              required: true
            }
          ]
        }
      ]
    }
    // TODO: fix it
  })) as IUserAuthInfo | null

  if (!DiaryUserAuth) {
    throw new ApiError(API_ERRORS.INVALID_TOKEN, 401)
  }

  const user = DiaryUserAuth.diaryUser
  const spoId = user.group.spo.id

  const {
    cookie,
    idFromDiary,
    groupId,
    firstName,
    lastName,
    middleName,
    termStartDate,
    termLastDateUpdate: termLastUpdate,
    id: localUserId
  } = user

  const toSave = {
    cookie,
    idFromDiary,
    localUserId,
    groupId,
    spoId,
    firstName,
    lastName,
    middleName,
    termLastUpdate,
    termStartDate,
    token
  }

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

export const updateCache = async (newCache: ICacheData) => {
  await memoryCache.set(newCache.token, newCache)
}

export const deleteCache = async (token: string) => {
  await memoryCache.del(token)
}
