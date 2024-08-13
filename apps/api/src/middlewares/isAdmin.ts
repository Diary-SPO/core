import { NotFoundError } from '@api'
import { AuthModel } from '@models'
import type { Context } from 'elysia'

export const isAdmin = async ({ request }): Context => {
  const user = await AuthModel.findOne({
    where: {
      token: String(request.headers.toJSON().secret)
    }
  })

  // Делаем вид, что такого роута на сервере нет
  if (!user || !user.isAdmin) {
    throw new NotFoundError("You're not an admin")
  }
}
