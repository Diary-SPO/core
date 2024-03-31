import { API_CODES, API_ERRORS, ApiError } from '@api'
import { getCookieFromToken } from '@helpers'
import { authLogout } from '@models'
import type { Context } from 'elysia'

const logoutHandler = async ({ request }: Context) => {
  const secret = request.headers.toJSON().secret

  const authData = await getCookieFromToken(secret)

  authLogout(authData)

  return {
    success: true
  }
}

export default logoutHandler
