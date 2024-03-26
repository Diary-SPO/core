import { ResponseLogin } from '@diary-spo/shared'
import { ServerResponse } from '@types'
import makeRequest from '../makeRequest'

export const postLogin = async (
  login: string,
  password: string,
  isHash: boolean
): ServerResponse<ResponseLogin> => {
  return makeRequest<ResponseLogin>(
    '/login/',
    'POST',
    JSON.stringify({
      login,
      password,
      isHash
    })
  )
}
