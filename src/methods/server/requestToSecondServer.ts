import { SECOND_SERVER_URL } from '../../config'
import { ServerResponse } from '../../types'

const requestToSecondServer = async <T>(
  route: string,
  cookie: string,
  url: string
): ServerResponse<T> => {
  const secondServerResponse = await fetch(SECOND_SERVER_URL + route, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      secret: cookie,
    },
  })

  if (secondServerResponse.status === 429) {
    console.log(secondServerResponse.status)
    return secondServerResponse.status
  }

  if (!secondServerResponse.ok) {
    throw new Error(`Failed to fetch data from ${url} and SECOND_SERVER`)
  }

  return (await secondServerResponse.json()) as T
}

export default requestToSecondServer
