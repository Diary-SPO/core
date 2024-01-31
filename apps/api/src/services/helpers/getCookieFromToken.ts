import { ApiError } from '@api'
import { formatDate } from '@utils'
import { AuthModel, DiaryUserModel } from '../models'
import { CookieInfoFromDatabase } from '../tables'

type TokenType = {
  cookie: string
  lastUsedDate: string
  addedSeconds: number // количество секунд с добавления
}

type CacheTokensCookie = Record<string, TokenType>

const cacheTokensCookie: CacheTokensCookie = {}
let nearestExpiringToken = null // Ближайшая старая запись в кеше. Бережём ядро, не занимаем ненужными операциями
const maxTokenLifeTimeCache = 60 * 5 // 5 минут
const maxElementsFromCache = 1000 // Максимум токенов, хранящихся в памяти

/**
 * Возвращает куку при предъявлении токена
 * @param token
 * @returns {string} cookie
 */
export const getCookieFromToken = async (token: string): Promise<string> => {
  const getCacheFromCookie = cacheGetter(token)

  if (getCacheFromCookie) {
    updaterDateFromToken(token) // Обновляем дату последнего использования куки, если нужно
      .catch((err) => {
        console.log(err.toString())
      })
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

  const authData: CookieInfoFromDatabase = {
    id: DiaryUserAuth.dataValues.id,
    idDiaryUser: DiaryUserAuth.dataValues.diaryUser.id,
    token: DiaryUserAuth.dataValues.token,
    lastUsedDate: DiaryUserAuth.dataValues.lastUsedDate,
    cookie: DiaryUserAuth.dataValues.diaryUser.cookie
  }

  taskScheduler(authData) // Запускает обслуживание кеширования токенов + сохраняет текущий токен в кэше
    .catch((err) => {
      console.log(err.toString())
    })

  updaterDateFromToken(token) // Обновляем дату последнего использования куки, если нужно
    .catch((err) => {
      console.log(err.toString())
    })

  return authData.cookie
}

/**
 * Кеширует куку по токену и очищает кеш, если он слишком большой
 * @param saveData
 * @returns {void}
 */
const taskScheduler = async (
  saveData: CookieInfoFromDatabase
): Promise<void> => {
  // Добавляем/обновляем информацию в кэше
  const expiring = new Date().getTime() / 1000
  cacheTokensCookie[saveData.token] = {
    cookie: saveData.cookie,
    lastUsedDate: saveData.lastUsedDate,
    addedSeconds: expiring
  }

  if (!expiring) {
    nearestExpiringToken = expiring + maxTokenLifeTimeCache
  }

  // Если кеш разросся слишком сильно, то нужно обработать
  const actualLengthCache = Object.keys(cacheTokensCookie).length // Сохраняем, чтобы не пересчитывать
  if (actualLengthCache > maxElementsFromCache) {
    const actualSeconds = new Date().getTime() / 1000
    if (expiring >= actualSeconds) {
      return
    }

    let newNearestExpiringToken = Number.MAX_VALUE
    // ВОТ ТУТ ПРОВЕРИТЬ ИТЕРАЦИЮ, ПЕРЕДЕЛАЛ !
    for (const token of cacheTokensCookie) {
      const currAddedSeconds = cacheTokensCookie[token].addedSeconds
      if (currAddedSeconds < actualSeconds) {
        delete cacheTokensCookie[token]
        return
      }

      if (
        currAddedSeconds < newNearestExpiringToken ||
        !newNearestExpiringToken
      ) {
        newNearestExpiringToken = currAddedSeconds
      }
    }

    nearestExpiringToken = newNearestExpiringToken
  }
}

const updaterDateFromToken = async (
  token: CookieInfoFromDatabase | string
): Promise<void> => {
  // Предварительно обновляем дату использования, если нужно
  const currDateFormatted = formatDate(new Date().toISOString())
  const saveData = typeof token !== 'string' ? token : cacheTokensCookie[token]

  if (formatDate(String(saveData.lastUsedDate)) === currDateFormatted) {
    return
  }

  // Обновляем в базе последнее время активности токена, если оно отличается от "сегодня"
  const updateToken = await AuthModel.update(
    {
      lastUsedDate: currDateFormatted
    },
    {
      where: {
        token
      },
      returning: true
    }
  )

  // Если смогли обновить, то сохраняем новую дату
  if (updateToken) {
    saveData.lastUsedDate = currDateFormatted
  }
}

/**
 * Возвращает куку, если она закеширована, или null, если она отсутствует
 * @param token
 * @returns {string} cookie
 * @returns {null}
 */
const cacheGetter = (token: string): string | null => {
  const cacheCookie = cacheTokensCookie?.[token]

  if (!cacheCookie) {
    return null
  }

  return cacheCookie.cookie
}
