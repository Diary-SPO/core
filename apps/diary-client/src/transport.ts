export type DiaryHttpMethod = 'GET' | 'POST'

export interface DiaryHttpRequest {
  method: DiaryHttpMethod
  url: string
  headers?: Record<string, string>
  body?: unknown
}

export interface DiaryHttpResponse<T> {
  data: T
  status: number
  headers: Record<string, string>
}

/**
 * Транспорт. Отвечает за хранилище cookie
 */
export interface DiaryHttpTransport {
  request<T>(request: DiaryHttpRequest): Promise<DiaryHttpResponse<T>>
  clearSession?(): Promise<void>
}
