import type {
  AcademicRecord,
  AttestationResponse,
  Day,
  NotificationsResponse,
  PerformanceCurrent,
  ResponseLogin
} from '@diary-spo/shared'

export interface ApiFailure {
  status: number
  value?: unknown
}

export type ApiResponse<T> =
  | { data: T; error: null; status: number }
  | { data: T; error: ApiFailure; status: number }

export interface DiaryApi {
  login(
    login: string,
    password: string,
    isHash: boolean,
    diaryUrl?: string
  ): Promise<ApiResponse<ResponseLogin>>
  loginWithEsia(diaryUrl?: string): Promise<ApiResponse<ResponseLogin>>
  logout(): Promise<ApiResponse<{ success: boolean }>>
  getLessons(startDate: string, endDate: string): Promise<ApiResponse<Day[]>>
  getPerformance(): Promise<ApiResponse<PerformanceCurrent>>
  getAttestation(): Promise<ApiResponse<AttestationResponse | null>>
  getFinalMarks(): Promise<ApiResponse<AcademicRecord>>
  getAds(): Promise<ApiResponse<NotificationsResponse[]>>
}

export type EsiaLoginMode = 'webview'

export const BACKGROUND_GRADE_INTERVALS = [15, 30, 60, 120] as const

export type BackgroundGradeInterval =
  (typeof BACKGROUND_GRADE_INTERVALS)[number]

export interface BackgroundGradeSettings {
  enabled: boolean
  intervalMinutes: BackgroundGradeInterval
}

export interface BackgroundGradeNotifications {
  readonly supported: boolean
  getSettings(): BackgroundGradeSettings
  setSettings(
    settings: BackgroundGradeSettings
  ): Promise<BackgroundGradeSettings>
}

export interface ShareContentOptions {
  title?: string
  text?: string
  url?: string
  dialogTitle?: string
}

export interface RegionProbeResult {
  url: string
  result: 'ok' | 'denied' | 'unreachable'
  status: number | null
}

export interface RegionSearchResult {
  regionUrl: string | null
  supported: boolean
  checked: number
  results: RegionProbeResult[]
}
