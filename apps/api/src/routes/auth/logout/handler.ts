import { getCookieFromToken } from '@helpers'
import { authLogout } from '../../../models/Auth'

import type { Token } from '../../../types'

type Params = Token

const logoutHandler = async ({ token }: Params) => {
  const authData = await getCookieFromToken(token)

  await authLogout(authData)

  return {
    success: true
  }
}

export default logoutHandler
