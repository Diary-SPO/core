import type { Context } from 'elysia'

import { getCookieFromToken } from '@helpers'
import { authLogout } from '@models'

const logoutHandler = async ({ request }: Context) => {
  const secret = request.headers.toJSON().secret

  const authData = await getCookieFromToken(secret)

  authLogout(authData)

  return {
    success: true
  }
}

export default logoutHandler
