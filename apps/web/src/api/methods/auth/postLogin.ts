import type { ResponseLogin } from '@diary-spo/shared'
import type { ServerResponse } from '@types'
import makeRequest from '../../makeRequest.ts'

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
