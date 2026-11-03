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

export interface ForgottenGradeMark {
  day: string
  mark: string
  subjectName: string
}

export interface BackgroundGradeDebugRetestResult {
  forgotten: ForgottenGradeMark | null
  reason?: 'empty' | 'corrupt' | 'noSession'
}

export interface BackgroundGradeNotifications {
  readonly supported: boolean
  getSettings(): BackgroundGradeSettings
  setSettings(
    settings: BackgroundGradeSettings
  ): Promise<BackgroundGradeSettings>
  clearSession(): Promise<void>
  debugRetestNotification(): Promise<BackgroundGradeDebugRetestResult>
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

export interface AppIconOption {
  id: string
  name: string
}

export interface AppIconController {
  readonly supported: boolean
  getOptions(): Promise<AppIconOption[]>
  getCurrent(): Promise<string>
  setIcon(iconId: string): Promise<string>
}

/** Версия приложения: в APK из Android, в вебе из env. */
export type GetAppVersion = () => Promise<string>

export interface SystemAccentColors {
  base: string
  hover: string
  active: string
}

/** Системный акцент: на Android — Material You, в вебе — CSS AccentColor / null. */
export type GetSystemAccent = () => Promise<SystemAccentColors | null>

export type AppUpdateChannel = 'stable' | 'beta'

export type AppUpdateKind = 'none' | 'web' | 'native' | 'ready' | 'downloading'

export interface AppUpdateInfo {
  version: string
  notes: string
  minNative: number
  channel: AppUpdateChannel
  url: string
  checksum: string
}

export interface AppUpdateStatus {
  supported: boolean
  channel: AppUpdateChannel
  currentVersion: string
  nativeVersionCode: number
  kind: AppUpdateKind
  available: AppUpdateInfo | null
  downloadedVersion: string | null
  badge: boolean
  progress: number | null
  lastError: string | null
}

export interface AppUpdaterDebugPromptOptions {
  /** Показать панель даже если обновления нет (мок для UI). */
  force?: boolean
}

export interface AppUpdater {
  readonly supported: boolean
  getStatus(): AppUpdateStatus
  subscribe(listener: (status: AppUpdateStatus) => void): () => void
  getChannel(): AppUpdateChannel
  setChannel(channel: AppUpdateChannel): Promise<AppUpdateStatus>
  /** Проверка манифеста канала; при необходимости показывает UI через события. */
  check(options?: { silent?: boolean }): Promise<AppUpdateStatus>
  download(): Promise<AppUpdateStatus>
  apply(): Promise<void>
  /** Удалить скачанные бандлы и вернуться к встроенному. */
  reset(): Promise<AppUpdateStatus>
  dismiss(): AppUpdateStatus
  clearBadge(): AppUpdateStatus
  /** Dev: открыть панель обновления. */
  debugOpenPrompt(options?: AppUpdaterDebugPromptOptions): void
  /** Dev: принудительно скачать текущий available (или check+download). */
  debugForceDownload(): Promise<AppUpdateStatus>
}
