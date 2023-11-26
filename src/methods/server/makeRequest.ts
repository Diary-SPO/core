import { BASE_URL } from '../../config'
import requestToSecondServer from './requestToSecondServer.ts'
import { ServerResponse } from '../../types'

const makeRequest = async <T>(route: string): ServerResponse<T> => {
  const cookie =
    localStorage.getItem('token') ?? sessionStorage.getItem('token')
  const url = `${BASE_URL}${route}`

  if (!cookie) {
    return 418
  }

  try {
    const response = await fetch(BASE_URL + route, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        secret: cookie,
      },
    })

    if (response.status === 429) {
      console.log(response.status)
      return response.status
    }

    if (!response.ok) {
      await requestToSecondServer(route, cookie, url)
    }

    return (await response.json()) as T
  } catch (err) {
    console.error(err)
    await requestToSecondServer(route, cookie, url)
  }
}

export default makeRequest
