import { BASE_URLS } from '@config'
import { HTTP_STATUSES, ServerResponse } from '@types'
import axios, { AxiosError, AxiosResponse } from 'axios'

const makeRequest = async <T>(
  route: string,
  method: 'POST' | 'GET' = 'GET',
  body?: BodyInit
): Promise<ServerResponse<T>> => {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    secret: token
  }

  for (const BASE_URL of BASE_URLS) {
    try {
      const response = await axios<T>({
        method,
        url: `${BASE_URL}${route}`,
        headers,
        data: body,
        timeout: 2000
      })

      console.info('%c [makeRequest]', 'color: blueviolet', response)

      return response.data
    } catch (err) {
      console.info('%c [makeRequest]', 'color: blueviolet', err)

      if (!(err instanceof AxiosError)) {
        return
      }

      /** В случае ошибки авторизации мы не делаем запрос на другой сервер, а сразу возвращаем ответ **/
      if (err?.response?.status === HTTP_STATUSES.UNAUTHORIZED) {
        return err.response
      }
    }
  }

  /** Если ни один сервер не был обработан верно **/
  return new Response('', {
    status: 520,
    headers: { 'Content-Type': 'application/json' }
  }) as unknown as AxiosResponse
}

export default makeRequest
