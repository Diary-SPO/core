import type { ResponseLogin } from '@diary-spo/shared'
import type { ServerResponse } from '@types'

import { api } from '../../api.ts'

export const postLogin = async (
  login: string,
  password: string,
  isHash: boolean
): ServerResponse<ResponseLogin> => {
  const { data } = await api.login.post({
    login,
    password,
    isHash
  })

  return data
}
