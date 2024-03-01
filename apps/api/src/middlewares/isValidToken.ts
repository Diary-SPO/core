import { AuthModel, DiaryUserModel } from '@models'
import { Context } from 'elysia'
import { UnauthorizedError } from '@api'

export const isValidToken = async ({ request }): Context => {
  const user = await AuthModel.findOne({
    where: {
      token: String(request.headers.toJSON().secret)
    }
  })

  if (!user) {
    throw new UnauthorizedError()
  }
}
