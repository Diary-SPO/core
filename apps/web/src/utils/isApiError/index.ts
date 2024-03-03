import { AxiosResponse } from 'axios'

export const isApiError = (data: unknown): data is AxiosResponse => {
  const isObj = typeof data === 'object'
  const isResponse = data instanceof Response

  return (
    !data ||
    isObj &&
    (isResponse ||
      ('status' in data &&
        typeof data.status === 'number' &&
        'statusText' in data &&
        typeof data.statusText === 'string'))
  )
}
