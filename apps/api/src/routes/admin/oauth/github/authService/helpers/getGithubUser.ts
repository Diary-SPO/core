import { GitHubUser } from './types'
import axios from 'axios'
import { ApiError } from '@api'

export const getGithubUser = async ({
  access_token
}: {
  access_token: string
}): Promise<GitHubUser> => {
  console.log('access_token', access_token)
  try {
    const { data } = await axios.get<GitHubUser>(
      'https://api.github.com/user',
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    )

    return data
  } catch (e) {
    console.log('OAuth error', e)
    throw new ApiError('OAuth GitHub Error getGithubUser', 520)
  }
}
