import { CapacitorCookies, CapacitorHttp } from '@capacitor/core'
import {
  DiaryClient,
  DiaryClientError,
  type DiaryHttpRequest,
  type DiaryHttpTransport,
  extractAuthCookie
} from '@diary-spo/diary-client'
import type {
  ApiResponse,
  DiaryApi
} from '../../web/src/shared/api/runtime/types.ts'
import {
  backgroundGradeNotifications,
  clearBackgroundGradeSession,
  syncBackgroundGradeSession
} from './background-grade-notifications.ts'

export { backgroundGradeNotifications }

const defaultBaseUrl = import.meta.env.VITE_DIARY_URL || 'https://poo.tomedu.ru'
const cookieStorageKey = 'directDiaryCookies'
const baseUrlStorageKey = 'directDiaryBaseUrl'

const normalizeBaseUrl = (value: string): string => {
  const url = new URL(value)
  if (url.protocol !== 'https:') {
    throw new DiaryClientError('Diary URL must use HTTPS', 400)
  }

  return url.origin
}

let activeBaseUrl = normalizeBaseUrl(
  localStorage.getItem(baseUrlStorageKey) || defaultBaseUrl
)

const getStoredCookie = (): string =>
  localStorage.getItem(cookieStorageKey) ?? ''

const getResponseCookies = (responses: Record<string, string>[]) =>
  extractAuthCookie(
    responses
      .map(
        (headers) =>
          Object.entries(headers).find(
            ([key]) => key.toLowerCase() === 'set-cookie'
          )?.[1]
      )
      .filter((header): header is string => Boolean(header))
      .join(', ')
  )

const createTransport = (baseUrl: string): DiaryHttpTransport => ({
  async request<T>({ method, url, headers, body }: DiaryHttpRequest) {
    const isLoginRequest = url.endsWith('/services/security/login')
    const storedCookie = getStoredCookie()
    const shouldUseStoredCookie = !isLoginRequest && storedCookie

    const response = await CapacitorHttp.request({
      method,
      url,
      headers: {
        ...headers,
        ...(shouldUseStoredCookie ? { Cookie: storedCookie } : {})
      },
      data: body
    })

    return {
      data: response.data as T,
      status: response.status,
      headers: response.headers
    }
  },
  async clearSession() {
    const storedCookie = getStoredCookie()
    localStorage.removeItem(cookieStorageKey)

    const cookieKeys = storedCookie
      .split(';')
      .map((cookie) => cookie.trim().split('=', 1)[0])
      .filter(Boolean)

    for (const key of cookieKeys) {
      await CapacitorCookies.deleteCookie({ url: baseUrl, key })
    }
    await CapacitorCookies.clearCookies({ url: baseUrl })
    await CapacitorCookies.clearAllCookies()
  }
})

const createClient = (baseUrl: string) =>
  new DiaryClient(baseUrl, createTransport(baseUrl))

let client = createClient(activeBaseUrl)

const storedStudentId = Number(localStorage.getItem('id'))
if (Number.isInteger(storedStudentId) && storedStudentId > 0) {
  client.restoreSession(storedStudentId)
}

const success = <T>(data: T): ApiResponse<T> => ({
  data,
  error: null,
  status: 200
})

const failure = <T>(error: unknown): ApiResponse<T> => {
  const status = error instanceof DiaryClientError ? error.status : 520
  return {
    data: null as T,
    error: { status, value: error },
    status
  }
}

const execute = async <T>(
  action: () => Promise<T>
): Promise<ApiResponse<T>> => {
  try {
    return success(await action())
  } catch (error) {
    return failure(error)
  }
}

export const diaryApi: DiaryApi = {
  login: (login, password, _isHash, diaryUrl) =>
    execute(async () => {
      await client.logout()

      const nextBaseUrl = normalizeBaseUrl(diaryUrl || activeBaseUrl)
      const nextClient = createClient(nextBaseUrl)

      if (nextBaseUrl !== activeBaseUrl) await nextClient.logout()

      try {
        const { user, responseHeaders } = await nextClient.login({
          login,
          password
        })
        const responseCookies = getResponseCookies(responseHeaders)

        if (!responseCookies) {
          throw new DiaryClientError('Login response has no cookies', 502)
        }

        activeBaseUrl = nextBaseUrl
        client = nextClient
        localStorage.setItem(baseUrlStorageKey, activeBaseUrl)
        localStorage.setItem(cookieStorageKey, responseCookies)
        const cookie = getStoredCookie()
        try {
          await syncBackgroundGradeSession(
            cookie,
            Number(user.id),
            activeBaseUrl
          )
        } catch (error) {
          console.error('Unable to sync background grade session', error)
        }
        return user
      } catch (error) {
        await nextClient.logout()
        throw error
      }
    }),
  logout: () =>
    execute(async () => {
      try {
        return await client.logout()
      } finally {
        await clearBackgroundGradeSession()
      }
    }),
  getLessons: (startDate, endDate) =>
    execute(() => client.getLessons(startDate, endDate)),
  getPerformance: () => execute(() => client.getPerformance()),
  getAttestation: () => execute(() => client.getAttestation()),
  getFinalMarks: () => execute(() => client.getFinalMarks()),
  getAds: () => execute(() => client.getAds())
}

if (storedStudentId > 0 && getStoredCookie()) {
  void syncBackgroundGradeSession(
    getStoredCookie(),
    storedStudentId,
    activeBaseUrl
  ).catch((error) =>
    console.error('Unable to sync background grade session', error)
  )
}
