import { AxiosResponse } from 'axios'

export const isApiError = (data: any): data is AxiosResponse => {
  return (
    typeof data === 'object' &&
    (data instanceof Response ||
      (typeof data.status === 'number' && typeof data.statusText === 'string'))
  )
}
