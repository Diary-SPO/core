import { API_CODES, API_ERRORS, ApiError } from '@api'
import { getCookieFromToken } from '@helpers'
import { authLogout } from '@models'
import type { Context } from 'elysia'

const logoutHandler = async ({
  request
}: Context) => {
  const secret = request.headers.toJSON().secret
  if (!secret) {
    throw new ApiError(API_ERRORS.INVALID_TOKEN, API_CODES.UNAUTHORIZED)
  }

  const authData = await getCookieFromToken(request.headers.toJSON().secret)

  authLogout(authData)

  return {
    token: authData.token,
    success: true
  }
}

export default logoutHandler
