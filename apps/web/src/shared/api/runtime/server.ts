import { client } from '../client.ts'
import type {
  BackgroundGradeNotifications,
  DiaryApi,
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
  _regionUrls: string[]
): Promise<{
  regionUrl: string | null
  supported: boolean
}> => ({ regionUrl: null, supported: false })

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
