import { BASE_URL } from '../../config'
import requestToSecondServer from './requestToSecondServer.ts'
import { ServerResponse } from '../../types'

const makeRequest = async <T>(
  route: string,
  method: 'POST' | 'GET' = 'GET',
  body: BodyInit,
): Promise<ServerResponse<T>> => {
  const cookie = localStorage.getItem('cookie')
  const url = `${BASE_URL}${route}`
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 3000)
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        secret: cookie,
      },
      body,
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    
    if (response.status === 429 || !response.ok) {
      // If the response status is 429 or not OK, proceed with the second server request
      return requestToSecondServer(route, cookie, method, body)
    }
    
    return (await response.json()) as T
  } catch (err) {
    console.error(err)
    
    if (err.name === 'AbortError') {
      // Handle timeout error
      return requestToSecondServer(route, cookie, method, body)
    } else {
      // Handle other errors without rethrowing
      console.error('Error occurred, but continuing with second server request:', err)
      return requestToSecondServer(route, cookie, method, body)
    }
  }
}

export default makeRequest
