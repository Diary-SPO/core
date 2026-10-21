import type { ResponseLogin } from '@diary-spo/shared'
import { client } from '../client.ts'
import type {
  ApiResponse,
  BackgroundGradeNotifications,
  DiaryApi,
  RegionSearchResult,
  ShareContentOptions
} from './types.ts'

const defaultBackgroundSettings = {
  enabled: false,
  intervalMinutes: 30 as const
}

export const backgroundGradeNotifications: BackgroundGradeNotifications = {
  supported: false,
  getSettings: () => defaultBackgroundSettings,
  setSettings: async () => defaultBackgroundSettings
}

export const shareContent = async (
  options: ShareContentOptions
): Promise<boolean> => {
  if (!navigator.share) return false

  const { title, text, url } = options
  await navigator.share({ title, text, url })
  return true
}

// В web-сборке нативного детекта VPN нет, регион один и задан сервером.
export const isVpnActive = async (): Promise<{
  active: boolean
  supported: boolean
}> => ({ active: false, supported: false })

export const findWorkingRegion = async (
  _login: string,
  _passwordHash: string,
  _regionUrls: string[],
  _onProgress?: (checked: number, total: number) => void,
  _excludeUrl?: string
): Promise<RegionSearchResult> => ({
  regionUrl: null,
  supported: false,
  checked: 0,
  results: []
})

// В web-сборке секреты не храним, перелогин недоступен.
export const hasSavedCredentials = async (): Promise<boolean> => false

export const getSavedAccount = async (): Promise<{
  login: string
  diaryUrl: string
} | null> => null

export const clearSavedCredentials = async (): Promise<void> => {}

export const reloginWithSavedCredentials = async (): Promise<
  ApiResponse<ResponseLogin>
> => ({
  data: null as unknown as ResponseLogin,
  error: {
    status: 501,
    value: new Error('Saved credentials are not supported in the web build')
  },
  status: 501
})

export const diaryApi: DiaryApi = {
  login: (login, password, isHash) =>
    client.auth.login.post({ login, password, isHash }) as ReturnType<
      DiaryApi['login']
    >,
  loginWithEsia: async () => ({
    data: null as never,
    error: {
      status: 501,
      value: new Error('ESIA login is not enabled for the web build')
    },
    status: 501
  }),
  logout: () => client.auth.logout.get() as ReturnType<DiaryApi['logout']>,
  getLessons: (startDate, endDate) =>
    client.lessons({ startDate })({ endDate }).get() as ReturnType<
      DiaryApi['getLessons']
    >,
  getPerformance: () =>
    client.performanceCurrent.get() as ReturnType<DiaryApi['getPerformance']>,
  getAttestation: () =>
    client.attestation.get() as ReturnType<DiaryApi['getAttestation']>,
  getFinalMarks: () =>
    client.finalMarks.get() as ReturnType<DiaryApi['getFinalMarks']>,
  getAds: () => client.ads.get() as ReturnType<DiaryApi['getAds']>
}
