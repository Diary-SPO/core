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
    isHash: boolean
  ): Promise<ApiResponse<ResponseLogin>>
  logout(): Promise<ApiResponse<{ success: boolean }>>
  getLessons(startDate: string, endDate: string): Promise<ApiResponse<Day[]>>
  getPerformance(): Promise<ApiResponse<PerformanceCurrent>>
  getAttestation(): Promise<ApiResponse<AttestationResponse | null>>
  getFinalMarks(): Promise<ApiResponse<AcademicRecord>>
  getAds(): Promise<ApiResponse<NotificationsResponse[]>>
}

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
