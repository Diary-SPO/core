import { BASE_URL } from '@config'
import { HTTP_STATUSES, ServerResponse } from '../types'
import requestToSecondServer from './requestToSecondServer.ts'

const makeRequest = async <T>(
  route: string,
  method: 'POST' | 'GET' = 'GET',
  body?: BodyInit
): Promise<ServerResponse<T>> => {
  const token = localStorage.getItem('token')
  const url = `${BASE_URL}${route}`

  const controller = new AbortController()
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

    if (!response.ok) {
      return requestToSecondServer(route, token, method, body)
    }

    return (await response.json()) as T
  } catch (err) {
    console.error(err)
    return requestToSecondServer(route, token, method, body)
  }
}

export default makeRequest
