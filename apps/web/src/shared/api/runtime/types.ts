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
