import { ApiError } from '@api'
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URL } from '@config'
import axios from 'axios'
import qs from 'qs'
import type { GitHubOauthToken } from './types'

export const getGithubOathToken = async ({
  code
}: {
  code: string
}): Promise<GitHubOauthToken> => {
  const rootUrl = 'https://github.com/login/oauth/access_token'
  const options = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_url: REDIRECT_URL,
    code
  }

  const queryString = qs.stringify(options)

  try {
    const { data } = await axios.post<GitHubOauthToken>(
      `${rootUrl}?${queryString}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    // @ts-expect-error ругается на типы, но тут все ок
    return qs.parse(data)
  } catch (e) {
    console.log('OAuth error', e)
    throw new ApiError('OAuth GitHub Error getGithubOathToken', 520)
  }
}
