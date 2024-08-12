import { Elysia } from 'elysia'
import { AuthModel } from './dto'
import postAuth from './handler'

export const AuthController = new Elysia({ prefix: '/auth' })
  .use(AuthModel)
  .post(
    '/login',
    ({ body: { login, password, isHash } }) =>
      postAuth({ login, password, isHash }),
    {
      detail: {
        tags: ['Auth']
      },
      body: 'auth.sign'
    }
  )
