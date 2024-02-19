import { SERVER_URL } from '@config'
import { getCookieFromToken } from '@db'
import type { Organization } from '@diary-spo/shared'
import { HeadersWithCookie } from '@utils'
import type { Context } from 'elysia'

const getOrganization = async ({
  request
}: Context): Promise<Organization | string> => {
  const authData = await getCookieFromToken(request.headers.toJSON().secret)
  const path = `${SERVER_URL}/services/people/organization`
  const response = await fetch(path, {
    headers: HeadersWithCookie(authData.cookie)
  })

  return await response.json()
}

export default getOrganization
