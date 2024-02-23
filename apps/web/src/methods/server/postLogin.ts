import { ServerResponse } from '@types'
import makeRequest from '../makeRequest'
import { ResponseLogin } from '@diary-spo/types'

export const postLogin = async (
  login: string,
  password: string,
  isHash: boolean
): ServerResponse<ResponseLogin> => {
  return makeRequest<ResponseLogin>(
    `'/login/'`,
    'POST',
    JSON.stringify({
      login,
      password,
      isHash
    })
  )
}
