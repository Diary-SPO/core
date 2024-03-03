export type HTTPMethods = 'GET' | 'POST'

export interface ApiResponse<T> {
  data: T
  headers: Headers
  status: number
}

interface Params {
  url: string
  method?: HTTPMethods
  body?: any
  cookie?: string
}

export const fetcher = async <T>({
  url,
  method = 'GET',
  body,
  cookie
}: Params): Promise<ApiResponse<T> | number> => {
  try {
    const response = await fetch(url, {
      method,
      body,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Cookie: cookie ?? ''
      }
    })

    if (!response.ok) {
      return response.status
    }

    return {
      data: (await response.json()) as T,
      headers: response.headers,
      status: response.status
    }
  } catch (error) {
    return 500
  }
}
