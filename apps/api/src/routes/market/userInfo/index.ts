import { Elysia } from 'elysia'
import { AuthPlugin } from '../../../services/AuthService'
import getUserInfo from './handler'

export const UserInfo = new Elysia()
  .use(AuthPlugin)
  .get('/userInfo', ({
    Auth: {
      user: {localUserId}
    }}) => getUserInfo(localUserId), {
    detail: {
      tags: ['market']
    }
  })
