import { ApiError } from '@api'
import { formatDate } from '@utils'
import { AuthModel, DiaryUserModel } from '../models'
import { CookieInfoFromDatabase } from '../tables'
import { maxDateInactive } from 'src/srcWorker/cookieUpdater/submodules/maxDateInactive'
import { MAX_NOT_UPDATE_TOKEN_IN_DAYS } from 'src/srcWorker/cookieUpdater/config'

type TokenType = {
  cookie: string
  lastUsedDate: string
  addedSeconds: number // количество секунд с добавления
  cookieLastDateUpdate: string
}

type CacheTokensCookie = Record<string, TokenType>

const cacheTokensCookie: CacheTokensCookie = {}
const maxElementsFromCache = 1000 // Максимум токенов, хранящихся в памяти
const maxTokenLife = 30 // 30 секунд

/**
 * Возвращает куку при предъявлении токена
 * @param token
 * @returns {string} cookie
 */
export const getCookieFromToken = async (token: string): Promise<string> => {
  const getCacheFromCookie = cacheGetter(token)

  // Если есть в кеше и дата истечения куки не подошла к пороговому значению, то обновляем и отдаём
  if (getCacheFromCookie 
    // Если по второму или тертьему условию не пройдёт, то просто извлечёт актуальную информацю и перезапишет
    && cacheTokensCookie[token].addedSeconds + maxTokenLife >= new Date().getTime() / 1000
    && cacheTokensCookie[token].cookieLastDateUpdate > formatDate(maxDateInactive(MAX_NOT_UPDATE_TOKEN_IN_DAYS).toISOString())
    ) {
    updaterDateFromToken(token) // Обновляем дату последнего использования куки, если нужно
      .catch((err) => {
        console.log(err.toString())
      })
    taskScheduler()
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
    id: DiaryUserAuth.id,
    idDiaryUser: DiaryUserAuth.diaryUser.id,
    token: DiaryUserAuth.token,
    lastUsedDate: DiaryUserAuth.lastUsedDate,
    cookie: DiaryUserAuth.diaryUser.cookie,
    cookieLastDateUpdate: DiaryUserAuth.diaryUser.cookieLastDateUpdate
  }

  saveToken(authData) // Запускает обслуживание кеширования токенов + сохраняет текущий токен в кэше
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
 * Очищает кеш, если он слишком большой
 * @returns {void}
 */
const saveToken = async (
  saveData: CookieInfoFromDatabase
): Promise<void> => {
  // Добавляем/обновляем информацию в кэше
  const expiring = new Date().getTime() / 1000
  cacheTokensCookie[saveData.token] = {
    cookie: saveData.cookie,
    lastUsedDate: saveData.lastUsedDate,
    addedSeconds: expiring,
    cookieLastDateUpdate: saveData.cookieLastDateUpdate
  }

  taskScheduler()
}

/**
 * Кеширует куку по токену и очищает кеш, если он слишком большой
 * @param saveData
 * @returns {void}
 */
const taskScheduler = async (): Promise<void> => {
  // Если кеш разросся слишком сильно, то нужно обработать (удаляем "неактивные")
  const actualLengthCache = Object.keys(cacheTokensCookie).length // Количество токенов в кеше
  if (actualLengthCache >= maxElementsFromCache) {
    const actualSeconds = new Date().getTime() / 1000

    // ВОТ ТУТ ПРОВЕРИТЬ ИТЕРАЦИЮ, ПЕРЕДЕЛАЛ !
    for (const token of cacheTokensCookie) {
      // Если максимальное время существования токена истекло, удаляем его
      const currAddedSeconds = cacheTokensCookie[token].addedSeconds
      if (currAddedSeconds + maxTokenLife >= actualSeconds) {
        return
      }
      delete cacheTokensCookie[token]
    }
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
