import { UnauthorizedError } from '@api'
import { AuthModel, DiaryUserModel } from '@models'
import type { Context } from 'elysia'

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
