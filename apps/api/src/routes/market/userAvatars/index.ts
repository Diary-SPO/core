import { Elysia } from 'elysia'
import { AuthPlugin } from '../../../services/AuthService'
import getUserAvatars from './handler'

export const UserAvatars = new Elysia()
  .use(AuthPlugin)
  .get('/userAvatars', ({Auth: {user: {localUserId}}}) => getUserAvatars(localUserId), {
    detail: {
      tags: ['user']
    }
  })
