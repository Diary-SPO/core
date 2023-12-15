import { SECOND_SERVER_URL } from '../../config'
import { ServerResponse } from '../../types'

const requestToSecondServer = async <T>(
  route: string,
  cookie: string,
  method: 'POST' | 'GET' = 'GET',
  body: BodyInit
): ServerResponse<T> => {
  const secondServerResponse = await fetch(SECOND_SERVER_URL + route, {
    method: method,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      secret: cookie,
    },
    body,
  })

  if (secondServerResponse.status === 429) {
    return secondServerResponse.status
  }

  if (!secondServerResponse.ok) {
    throw new Error(`Failed to fetch data from ${route} and SECOND_SERVER`)
  }

  return (await secondServerResponse.json()) as T
}

export default requestToSecondServer
