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

  return {
    ok: result ? result.ok : false,
    status: result ? result.status : 0,
    headers: result ? result.headers : ({} as Headers),
    json: async <T>() => (result as KyResponse).json<T>()
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
