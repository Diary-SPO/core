import { CapacitorCookies, CapacitorHttp } from '@capacitor/core'
import {
  DiaryClient,
  DiaryClientError,
  type DiaryHttpRequest,
  type DiaryHttpTransport
} from '@diary-spo/diary-client'
import type {
  ApiResponse,
  DiaryApi
} from '../../web/src/shared/api/runtime/types.ts'

const baseUrl = import.meta.env.VITE_DIARY_URL || 'https://poo.tomedu.ru'

const transport: DiaryHttpTransport = {
  async request<T>({ method, url, headers, body }: DiaryHttpRequest) {
    const response = await CapacitorHttp.request({
      method,
      url,
      headers,
      data: body
    })

    return {
      data: response.data as T,
      status: response.status,
      headers: response.headers
    }
  },
  async clearSession() {
    await CapacitorCookies.clearAllCookies()
  }
}

const client = new DiaryClient(baseUrl, transport)

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
    // Consumers inspect `error` before using data. Keeping the generic shape
    // aligned with Eden avoids runtime-specific branches throughout the UI.
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
  login: (login, password) => execute(() => client.login({ login, password })),
  logout: () => execute(() => client.logout()),
  getLessons: (startDate, endDate) =>
    execute(() => client.getLessons(startDate, endDate)),
  getPerformance: () => execute(() => client.getPerformance()),
  getAttestation: () => execute(() => client.getAttestation()),
  getFinalMarks: () => execute(() => client.getFinalMarks()),
  getAds: () => execute(() => client.getAds())
}
