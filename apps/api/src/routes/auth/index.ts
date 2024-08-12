import { Elysia } from 'elysia'
import { AuthPlugin } from '../../services/AuthService'
import { AuthModel } from './login/dto'
import postAuth from './login/handler'
import logoutHandler from './logout/handler'

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
  .use(AuthPlugin)
  .get(
    '/logout',
    ({
      Auth: {
        user: { token }
      }
    }) => logoutHandler({ token }),
    {
      detail: {
        tags: ['Student']
      }
    }
  )
