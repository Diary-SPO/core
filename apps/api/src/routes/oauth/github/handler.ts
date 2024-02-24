import { Context } from 'elysia'
import { getGithubOathToken, getGithubUser } from './authService'
import { HttpStatusCode } from 'axios'

interface AuthContext {
  body: {
    state?: string
    code: string
  }
}

const getGitHubAuth = async ({ body, set }: Context & AuthContext) => {
  const { code, state } = body
  console.log('code', code)

  try {
    const { access_token } = await getGithubOathToken({ code })

    const { id } = await getGithubUser({ access_token })

    return id
  } catch (e) {
    console.log('e', e)
    set.status = HttpStatusCode.UnprocessableEntity
  }
}

export default getGitHubAuth
