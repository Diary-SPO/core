import { App } from '@capacitor/app'
import type { PluginListenerHandle } from '@capacitor/core'
import { CapacitorCookies, CapacitorHttp } from '@capacitor/core'
import {
  DefaultSystemBrowserOptions,
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
  DiaryApi,
  EsiaLoginMode
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
const esiaRedirectUri =
  import.meta.env.VITE_ESIA_REDIRECT_URI || 'io.github.diaryspo://esia'
const esiaCallbackProtocol = 'io.github.diaryspo:'
const esiaCallbackHost = 'esia'

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

const getEsiaRedirectUri = (mode: EsiaLoginMode): string => {
  if (mode === 'webview' && esiaRedirectUri === 'io.github.diaryspo://esia') {
    return 'intent://esia#Intent;scheme=io.github.diaryspo;package=io.github.diaryspo;end'
  }

  const url = new URL(esiaRedirectUri)
  return url.toString()
}

const isEsiaCallback = (value: string, mode: EsiaLoginMode): boolean => {
  try {
    const url = new URL(value)
    const isAppCallback =
      url.protocol === esiaCallbackProtocol && url.hostname === esiaCallbackHost
    return isAppCallback
  } catch {
    return false
  }
}

const waitForEsiaCallback = async (
  mode: EsiaLoginMode,
  loginUrl: string
): Promise<string> =>
  new Promise((resolve, reject) => {
    let settled = false
    const handles: PluginListenerHandle[] = []

    const cleanup = async () => {
      await Promise.all(handles.map((handle) => handle.remove()))
    }
    const finish = async (callbackUrl: string) => {
      if (settled || !isEsiaCallback(callbackUrl, mode)) return
      settled = true
      await cleanup()
      if (mode === 'webview') await InAppBrowser.close()
      resolve(callbackUrl)
    }
    const cancel = async () => {
      if (settled) return
      settled = true
      await cleanup()
      reject(new DiaryClientError('ESIA login was cancelled', 499))
    }

    void (async () => {
      handles.push(
        await App.addListener('appUrlOpen', ({ url }) => {
          void finish(url)
        })
      )
      handles.push(
        await InAppBrowser.addListener(
          'browserPageNavigationCompleted',
          ({ url }) => {
            if (url) void finish(url)
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

      if (mode === 'webview') {
        await InAppBrowser.openInWebView({
          url: loginUrl,
          options: {
            ...DefaultWebViewOptions,
            showURL: true,
            showToolbar: true,
            clearCache: false,
            clearSessionCache: false
          }
        })
        return
      }

      await InAppBrowser.openInSystemBrowser({
        url: loginUrl,
        options: DefaultSystemBrowserOptions
      })
    })().catch(async (error) => {
      if (settled) return
      settled = true
      await cleanup()
      reject(error)
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
  loginWithEsia: (mode, diaryUrl) =>
    execute(async () => {
      await client.logout()

      const nextBaseUrl = normalizeBaseUrl(diaryUrl || activeBaseUrl)
      const nextClient = createClient(nextBaseUrl)

      if (nextBaseUrl !== activeBaseUrl) await nextClient.logout()

      try {
        const { loginUrl, responseHeaders } = await nextClient.prepareEsiaLogin(
          getEsiaRedirectUri(mode)
        )
        const settingsCookies = getResponseCookies(responseHeaders)

        persistCookies(settingsCookies, await getNativeCookies(nextBaseUrl))
        if (!getStoredCookie()) {
          throw new DiaryClientError(
            'ESIA settings response has no session cookie',
            502
          )
        }

        const callbackUrl = await waitForEsiaCallback(mode, loginUrl)
        const { user, responseHeaders: loginResponseHeaders } =
          await nextClient.completeEsiaLogin(callbackUrl)

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
