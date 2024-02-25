import { Context } from 'elysia'
import { getGithubOathToken, getGithubUser } from './authService'
import { HttpStatusCode } from 'axios'
import { REDIRECT_URL } from '../../../config/env'

interface AuthContext {
  query: {
    state: string
    code: string
  }
}

const getGitHubAuth = async ({ query, set, request }: Context & AuthContext) => {
  const { code, state } = query

  try {
    const { access_token } = await getGithubOathToken({ code })

    if (!access_token) {
      set.redirect = `${REDIRECT_URL}?error=401`
      return
    }

    const { id } = await getGithubUser({ access_token })

    // TODO: сделать сохранение токена

    set.redirect = `${REDIRECT_URL}?code=${code}&id=${id}`
    return id
  } catch (e) {
    console.log('OAuth error', e)
    set.status = HttpStatusCode.UnprocessableEntity
  }
}

export default getGitHubAuth
