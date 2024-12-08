import { ApiError } from '@api'
import { HTTP_STATUSES } from '@diary-spo/web/src/shared/types'
import ky, { type Input, type KyResponse, type Options } from 'ky'

const defaultKy = ky.extend({
  timeout: 10000, // 10 seconds
  retry: 2
})

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
  } catch {}

  if (!result) {
    throw new ApiError('Internal', HTTP_STATUSES.INTERNAL)
  }

  return {
    ok: result.ok,
    status: result.status,
    headers: result.headers,
    json: async <T>() => result.json<T>()
  }
}

export const fetcher = {
  get: async (url: Input, options: Options) => {
    return localFetcher('GET', url, options)
  },
  post: async (url: Input, options: Options) => {
    return localFetcher('POST', url, options)
  }
}
