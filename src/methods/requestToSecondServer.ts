import { SECOND_SERVER_URL } from '@config'
import { ServerResponse } from '../types'

const requestToSecondServer = async <T>(
  route: string,
  cookie: string,
  method: 'POST' | 'GET',
  body: BodyInit
): Promise<ServerResponse<T>> => {
  try {
    const secondServerResponse = await fetch(SECOND_SERVER_URL + route, {
      method: method,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        secret: cookie
      },
      body
    })

    if (!secondServerResponse.ok) {
      return secondServerResponse
    }

    return (await secondServerResponse.json()) as T
  } catch (e) {
    console.warn('[SECOND SERVER]', e)
    const isFatalError = e.toString() === 'TypeError: Failed to fetch'

    if (e.toString() === isFatalError) {
      console.warn('[is failed to fetch]')
      return { error: true }
    }
  }
}

export default requestToSecondServer
