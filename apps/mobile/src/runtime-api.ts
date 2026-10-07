import type { PluginListenerHandle } from '@capacitor/core'
import { CapacitorCookies, CapacitorHttp } from '@capacitor/core'
import {
  DefaultAndroidWebViewOptions,
  DefaultWebViewOptions,
  InAppBrowser
} from '@capacitor/inappbrowser'
import {
  DiaryClient,
  DiaryClientError,
  type DiaryHttpRequest,
  type DiaryHttpTransport,
  extractAuthCookie,
  mergeAuthCookies
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

const getNativeCookies = async (baseUrl: string): Promise<string> => {
  const cookies = await CapacitorCookies.getCookies({ url: baseUrl })
  return Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ')
}

const persistCookies = (...cookies: string[]) => {
  const mergedCookies = mergeAuthCookies(
    getStoredCookie(),
    ...cookies.filter(Boolean)
  )

  if (mergedCookies) {
    localStorage.setItem(cookieStorageKey, mergedCookies)
  }
}

const getDiaryHost = (baseUrl: string): string => new URL(baseUrl).hostname

const isDiaryUrl = (value: string, baseUrl: string): boolean => {
  try {
    return new URL(value).hostname === getDiaryHost(baseUrl)
  } catch {
    return false
  }
}

// Auth-тикет появляется только после логина.
const hasDiaryAuthCookies = (cookie: string): boolean =>
  cookie.includes('.AspNetCore.Cookies')

const parseCookiePairs = (cookieString: string): Array<[string, string]> => {
  const pairs: Array<[string, string]> = []
  for (const part of cookieString.split(';')) {
    const trimmed = part.trim()
    const separator = trimmed.indexOf('=')
    if (separator <= 0) continue
    pairs.push([trimmed.slice(0, separator), trimmed.slice(separator + 1)])
  }
  return pairs
}

// WebView и CapacitorHttp делят куки только вручную.
const syncCookiesToNative = async (
  baseUrl: string,
  ...cookies: string[]
): Promise<void> => {
  for (const cookieString of cookies.filter(Boolean)) {
    for (const [key, value] of parseCookiePairs(cookieString)) {
      try {
        await CapacitorCookies.setCookie({ url: baseUrl, key, value })
      } catch (error) {
        console.warn('Unable to sync cookie to native jar', key, error)
      }
    }
  }
}

const waitForEsiaWebViewLogin = async (
  baseUrl: string,
  loginUrl: string
): Promise<string> =>
  new Promise((resolve, reject) => {
    let settled = false
    const handles: PluginListenerHandle[] = []
    let sawEsia = false

    const cleanup = async () => {
      await Promise.all(handles.map((handle) => handle.remove()))
    }
    const finish = async (cookie: string) => {
      if (settled) return
      settled = true
      await cleanup()
      await InAppBrowser.close()
      resolve(cookie)
    }
    const cancel = async (error?: unknown) => {
      if (settled) return
      settled = true
      await cleanup()
      reject(
        error instanceof Error
          ? error
          : new DiaryClientError('ESIA login was cancelled', 499)
      )
    }

    const checkDiaryNavigation = async (url: string) => {
      if (!isDiaryUrl(url, baseUrl)) {
        sawEsia = true
        return
      }
      // Игнорируем дневник до ухода в ЕСИА.
      if (!sawEsia) return
      try {
        const parsed = new URL(url)
        if (parsed.searchParams.get('error')) {
          await cancel(
            new DiaryClientError(
              `ESIA login failed: ${parsed.searchParams.get('error')}`,
              401
            )
          )
          await InAppBrowser.close()
          return
        }
      } catch {}
      const cookie = await getNativeCookies(baseUrl)
      if (hasDiaryAuthCookies(cookie)) {
        await finish(cookie)
      }
    }

    void (async () => {
      handles.push(
        await InAppBrowser.addListener(
          'browserPageNavigationCompleted',
          ({ url }) => {
            if (url) void checkDiaryNavigation(url)
          }
        )
      )
      handles.push(
        await InAppBrowser.addListener('browserClosed', () => {
          setTimeout(() => {
            void cancel()
          }, 300)
        })
      )

      // Без общего процесса куки WebView недоступны.
      await InAppBrowser.openInWebView({
        url: loginUrl,
        options: {
          ...DefaultWebViewOptions,
          showURL: true,
          showToolbar: true,
          clearCache: false,
          clearSessionCache: false,
          android: {
            ...DefaultAndroidWebViewOptions,
            isIsolated: false
          }
        }
      })
    })().catch(async (error) => {
      await cancel(error)
    })
  })

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

    const responseCookies = getResponseCookies([response.headers])
    const nativeCookies = await getNativeCookies(baseUrl)
    persistCookies(responseCookies, nativeCookies)

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
  loginWithEsia: (diaryUrl?: string) =>
    execute(async () => {
      await client.logout()

      const nextBaseUrl = normalizeBaseUrl(diaryUrl || activeBaseUrl)
      const nextClient = createClient(nextBaseUrl)

      if (nextBaseUrl !== activeBaseUrl) await nextClient.logout()

      try {
        const { loginUrl, responseHeaders } =
          await nextClient.prepareEsiaLogin()
        const settingsCookies = getResponseCookies(responseHeaders)

        persistCookies(settingsCookies, await getNativeCookies(nextBaseUrl))
        if (!getStoredCookie()) {
          throw new DiaryClientError(
            'ESIA settings response has no session cookie',
            502
          )
        }
        await syncCookiesToNative(nextBaseUrl, getStoredCookie())

        const webViewCookies = await waitForEsiaWebViewLogin(
          nextBaseUrl,
          loginUrl
        )

        persistCookies(webViewCookies, await getNativeCookies(nextBaseUrl))
        await syncCookiesToNative(nextBaseUrl, getStoredCookie())

        const { user, responseHeaders: loginResponseHeaders } =
          await nextClient.finishEsiaLogin()

        persistCookies(
          getResponseCookies(loginResponseHeaders),
          await getNativeCookies(nextBaseUrl)
        )
        if (!getStoredCookie()) {
          throw new DiaryClientError('ESIA login response has no cookies', 502)
        }

        activeBaseUrl = nextBaseUrl
        client = nextClient
        localStorage.setItem(baseUrlStorageKey, activeBaseUrl)

        try {
          await syncBackgroundGradeSession(
            getStoredCookie(),
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
