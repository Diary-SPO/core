import type { ApiResponse } from '@types'

export const isApiError = (data: unknown): data is ApiResponse => {
  const isObj = typeof data === 'object'

  return Boolean(
    data &&
      isObj &&
      'error' in data &&
      data.error &&
      typeof data.error === 'object' &&
      'status' in data.error
  )
}
