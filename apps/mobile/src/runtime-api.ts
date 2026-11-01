import { App } from '@capacitor/app'
import type { PluginListenerHandle } from '@capacitor/core'
import {
  Capacitor,
  CapacitorCookies,
  CapacitorHttp,
  registerPlugin
} from '@capacitor/core'
import {
  DefaultAndroidWebViewOptions,
  DefaultWebViewOptions,
  InAppBrowser
} from '@capacitor/inappbrowser'
import { Share } from '@capacitor/share'
import {
  DiaryClient,
  DiaryClientError,
  type DiaryHttpRequest,
  type DiaryHttpTransport,
  extractAuthCookie,
  mergeAuthCookies
} from '@diary-spo/diary-client'
import type { ResponseLogin } from '@diary-spo/shared'
import type {
  ApiResponse,
  AppIconController,
  DiaryApi,
  GetAppVersion,
  RegionProbeResult,
  RegionSearchResult,
  ShareContentOptions
} from '../../web/src/shared/api/runtime/types.ts'
import { APP_VERSION } from '../../web/src/shared/config'
import {
  backgroundGradeNotifications,
  clearBackgroundGradeSession,
  syncBackgroundGradeSession
} from './background-grade-notifications.ts'
import { getDiaryCookies, setDiaryCookie } from './diary-cookies.ts'

export { backgroundGradeNotifications }

const connectTimeout = 15000
const readTimeout = 20000

export const getAppVersion: GetAppVersion = async () => {
  if (!Capacitor.isNativePlatform()) return APP_VERSION
  try {
    const info = await App.getInfo()
    // version - versionName из Android, build - versionCode.
    return info.build ? `${info.version} (${info.build})` : info.version
  } catch (error) {
    console.warn('Unable to read native app version', error)
    return APP_VERSION
  }
}

interface DiaryAppIconPlugin {
  getOptions(): Promise<{
    supported: boolean
    options: Array<{ id: string; name: string }>
  }>
  getCurrent(): Promise<{ iconId: string }>
  setIcon(options: { iconId: string }): Promise<{ iconId: string }>
}

const diaryAppIcon = registerPlugin<DiaryAppIconPlugin>('DiaryAppIcon')

export const appIcon: AppIconController = {
  supported: Capacitor.isNativePlatform(),
  getOptions: async () => {
    if (!Capacitor.isNativePlatform()) return []
    try {
      const response = await diaryAppIcon.getOptions()
      return response.options ?? []
    } catch (error) {
      console.warn('Unable to read app icon options', error)
      return []
    }
  },
  getCurrent: async () => {
    if (!Capacitor.isNativePlatform()) return 'default'
    try {
      const response = await diaryAppIcon.getCurrent()
      return response.iconId || 'default'
    } catch {
      return 'default'
    }
  },
  setIcon: async (iconId) => {
    if (!Capacitor.isNativePlatform()) return 'default'
    const response = await diaryAppIcon.setIcon({ iconId })
    return response.iconId || iconId
  }
}

interface DiaryNetworkPlugin {
  isVpnActive(): Promise<{ active: boolean }>
}

const diaryNetwork = registerPlugin<DiaryNetworkPlugin>('DiaryNetwork')

interface DiaryCredentialsPlugin {
  saveCredentials(options: {
    login: string
    password: string
    diaryUrl: string
  }): Promise<void>
  getCredentials(): Promise<{
    login: string
    password: string
    diaryUrl: string
  }>
  clearCredentials(): Promise<void>
}

const diaryCredentials =
  registerPlugin<DiaryCredentialsPlugin>('DiaryCredentials')

const readCredentials = async (): Promise<{
  login: string
  password: string
  diaryUrl: string
} | null> => {
  if (!Capacitor.isNativePlatform()) return null
  try {
    return await diaryCredentials.getCredentials()
  } catch {
    return null
  }
}

export const hasSavedCredentials = async (): Promise<boolean> =>
  (await readCredentials()) !== null

export const getSavedAccount = async (): Promise<{
  login: string
  diaryUrl: string
} | null> => {
  const credentials = await readCredentials()
  return credentials
    ? { login: credentials.login, diaryUrl: credentials.diaryUrl }
    : null
}

export const clearSavedCredentials = async (): Promise<void> => {
  if (!Capacitor.isNativePlatform()) return
  try {
    await diaryCredentials.clearCredentials()
  } catch (error) {
    console.warn('Unable to clear saved credentials', error)
  }
}

export const isVpnActive = async (): Promise<{
  active: boolean
  supported: boolean
}> => {
  if (!Capacitor.isNativePlatform()) return { active: false, supported: false }
  try {
    const { active } = await diaryNetwork.isVpnActive()
    return { active, supported: true }
  } catch {
    return { active: false, supported: false }
  }
}

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Region probe timed out')), ms)
    )
  ])

// Поиск региона перебором настоящим входом: как ручной, только по списку.
export const findWorkingRegion = async (
  login: string,
  passwordHash: string,
  regionUrls: string[],
  onProgress?: (checked: number, total: number) => void,
  excludeUrl?: string
): Promise<RegionSearchResult> => {
  // Исключаем текущий выбранный регион: там только что не вышло.
  // activeBaseUrl для этого не годится - в нём может лежать прошлая сессия.
  const excluded = (() => {
    try {
      return normalizeBaseUrl(excludeUrl || activeBaseUrl)
    } catch {
      return activeBaseUrl
    }
  })()
  const queue = regionUrls.filter((url) => {
    try {
      return normalizeBaseUrl(url) !== excluded
    } catch {
      return false
    }
  })
  const results: RegionProbeResult[] = []
  const pushResult = (probe: RegionProbeResult) => {
    results.push(probe)
    onProgress?.(results.length, queue.length)
  }

  // Кто вообще жив: быстро и параллельно, медленные - вторым кругом.
  const alive: string[] = []
  const slow: string[] = []
  {
    let index = 0
    const workers = Array.from(
      { length: Math.min(4, queue.length) },
      async () => {
        while (index < queue.length) {
          const url = queue[index++]
          try {
            const response = await withTimeout(
              CapacitorHttp.request({
                method: 'GET',
                url: `${normalizeBaseUrl(url)}/services/security/esia-settings`,
                connectTimeout,
                readTimeout
              }),
              6000
            )
            ;(response.status < 500 ? alive : slow).push(url)
          } catch {
            slow.push(url)
          }
        }
      }
    )
    await Promise.all(workers)
  }

  // Чужие куки в чужой регион не везём.
  const savedCookie = getStoredCookie()
  localStorage.removeItem(cookieStorageKey)
  let found: string | null = null
  try {
    // Сначала живые, потом притормаживающие - тоже настоящим входом.
    for (const url of [...alive, ...slow]) {
      const response = await diaryApi.login(login, passwordHash, true, url)
      if (response.error === null) {
        console.log('[region-probe] hit', url)
        found = url
        pushResult({ url, result: 'ok', status: response.status })
        break
      }
      console.log('[region-probe] miss', url, response.status)
      pushResult({
        url,
        result: response.status === 401 ? 'denied' : 'unreachable',
        status: response.status
      })
    }
  } finally {
    if (!found && savedCookie) {
      localStorage.setItem(cookieStorageKey, savedCookie)
    }
  }
  return { regionUrl: found, supported: true, checked: queue.length, results }
}

export const shareContent = async (
  options: ShareContentOptions
): Promise<boolean> => {
  const { value: canShare } = await Share.canShare()
  if (!canShare) return false

  await Share.share(options)
  return true
}

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
  // Auth-куки ставятся по http, читаем оба варианта схемы.
  const urls = [baseUrl, baseUrl.replace(/^https:/, 'http:')]
  const parts: string[] = []
  for (const url of urls) {
    try {
      parts.push(await getDiaryCookies(url))
    } catch (error) {
      console.warn('Unable to read native cookies', url, error)
    }
  }
  return mergeAuthCookies(...parts.filter(Boolean))
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

// UID выставляет сам дневник как маркер входа, до логина её нет.
const hasDiaryAuthCookies = (cookie: string): boolean =>
  /(?:^|;\s*)(UID|\.AspNetCore\.Cookies)=/.test(cookie)

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
  const urls = [baseUrl, baseUrl.replace(/^https:/, 'http:')]
  for (const cookieString of cookies.filter(Boolean)) {
    for (const [key, value] of parseCookiePairs(cookieString)) {
      for (const url of urls) {
        try {
          await setDiaryCookie(url, key, value)
        } catch (error) {
          console.warn('Unable to sync cookie to native jar', key, error)
        }
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
      const keys = cookie
        .split(';')
        .map((part) => part.trim().split('=', 1)[0])
        .filter(Boolean)
        .join(',')
      console.log('[esia] diary navigation', url.slice(0, 80), 'cookies:', keys)
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
      data: body,
      connectTimeout,
      readTimeout
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

const performPasswordLogin = async (
  login: string,
  password: string,
  diaryUrl?: string
) => {
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
      await syncBackgroundGradeSession(cookie, Number(user.id), activeBaseUrl)
    } catch (error) {
      console.error('Unable to sync background grade session', error)
    }
    return user
  } catch (error) {
    await nextClient.logout()
    throw error
  }
}

export const reloginWithSavedCredentials = async (): Promise<
  ApiResponse<ResponseLogin>
> =>
  execute(async () => {
    const credentials = await readCredentials()
    if (!credentials) {
      throw new DiaryClientError('No saved credentials', 401)
    }
    return performPasswordLogin(
      credentials.login,
      credentials.password,
      credentials.diaryUrl
    )
  })

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
      const user = await performPasswordLogin(login, password, diaryUrl)
      if (Capacitor.isNativePlatform()) {
        try {
          await diaryCredentials.saveCredentials({
            login,
            password,
            diaryUrl: activeBaseUrl
          })
        } catch (error) {
          console.warn('Unable to save credentials', error)
        }
      }
      return user
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

        await clearSavedCredentials()

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
        await clearSavedCredentials()
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
