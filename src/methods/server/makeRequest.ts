import { BASE_URL } from '../../config'
import { ServerResponse } from '../../types'
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
