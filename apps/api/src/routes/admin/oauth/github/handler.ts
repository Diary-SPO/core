import { Context } from 'elysia'
import { getGithubOathToken, getGithubUser } from './authService'
import { HttpStatusCode } from 'axios'
import { REDIRECT_URL } from '@config'
import { generateToken } from '@helpers'
import { DiaryUserModel } from '@models'
import { NotFoundError } from '@api'

interface AuthContext {
  query: {
    state: string
    code: string
  }
}

const getGitHubAuth = async ({
  query,
  set,
  request
}: Context & AuthContext) => {
  const { code, state } = query

  try {
    const { access_token } = await getGithubOathToken({ code })

    if (!access_token) {
      set.redirect = `${REDIRECT_URL}?error=401`
      return
    }

    const { id } = await getGithubUser({ access_token })

    const user = await DiaryUserModel.findOne({
      where: {
        gitHubId: id
      }
    })

    if (!user) {
      throw new NotFoundError('GitHub account not found')
    }

    // TODO: сделать сохранение токена
    const token = await generateToken(user.id)

    set.redirect = `${REDIRECT_URL}?code=${code}&id=${id}&token=${token}`
    return id
  } catch (e) {
    console.log('OAuth error', e)
    set.status = HttpStatusCode.UnprocessableEntity
  }
}

export default getGitHubAuth
