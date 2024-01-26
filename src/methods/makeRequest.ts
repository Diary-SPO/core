import { BASE_URLS } from '@config'
import { HTTP_STATUSES, ServerResponse } from '../types'

const makeRequest = async <T>(
  route: string,
  method: 'POST' | 'GET' = 'GET',
  body?: BodyInit
): Promise<ServerResponse<T>> => {
  const token = localStorage.getItem('token')

  const controller = new AbortController()

  for (let num in BASE_URLS) {
    const url = `${BASE_URLS[num]}${route}`
    const timeoutId = setTimeout(() => controller.abort(), 3000)
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          secret: token
        },
        body,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      /** В случае ошибки авторизации мы не делаем запрос на второй сервер, а сразу возвращаем ответ **/
      if (response.status === HTTP_STATUSES.UNAUTHORIZED) {
        return response
      }

      console.info('%c [makeRequest]', 'color: blueviolet', response)

      /** В случае другой ошибки пытаемся получить ответ от другого сервера **/
      if (!response.ok) {
        continue
      }

      return (await response.json()) as T
    } catch (err) {
      console.info('%c [makeRequest]', 'color: blueviolet', err)
      /** В случае ошибки пытаемся получить ответ от другого сервера в следующей итерации **/
    }
  }

  /** Если ни один сервер небыл верно обработан (ни успешной авторизации, ни ошибки) **/
  return new Response('', {
    status: 520,
    headers: { 'Content-Type': 'application/json' }
  })
}

export default makeRequest
