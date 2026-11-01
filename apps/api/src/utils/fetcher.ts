import ky, { type Input, type KyResponse, type Options } from 'ky'

const defaultKy = ky.extend({
  timeout: 10000, // 10 seconds
  retry: 2
})

const emptyHeaders = (): Headers => new Headers()

const localFetcher = async (
  method: 'GET' | 'POST',
  url: Input,
  options?: Options
) => {
  let result: KyResponse | null = null

  try {
    switch (method) {
      case 'GET':
        result = await defaultKy.get(url, options)
        break
      case 'POST':
        result = await defaultKy.post(url, options)
        break
    }
  } catch {
    // Сеть/таймаут - отдаём пустой ответ с настоящим Headers, без .get на {}
  }

  return {
    ok: result ? result.ok : false,
    status: result ? result.status : 0,
    headers: result?.headers ?? emptyHeaders(),
    json: async <T>() => {
      if (!result) {
        throw new Error(`Fetcher ${method} failed before response`)
      }
      return result.json<T>()
    }
  }
}

export const getSetCookieHeader = (
  headers: Headers | null | undefined
): string | null => {
  if (!headers || typeof headers.get !== 'function') return null

  // В Bun/undici несколько Set-Cookie удобнее читать так.
  const withList = headers as Headers & { getSetCookie?: () => string[] }
  if (typeof withList.getSetCookie === 'function') {
    const cookies = withList.getSetCookie()
    if (cookies.length > 0) return cookies.join(', ')
  }

  return headers.get('Set-Cookie')
}

export const fetcher = {
  get: async (url: Input, options: Options) => {
    return localFetcher('GET', url, options)
  },
  post: async (url: Input, options: Options) => {
    return localFetcher('POST', url, options)
  }
}
