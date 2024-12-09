import {Elysia, t} from 'elysia'
import { AuthPlugin } from '../../../services/AuthService'
import userSaveAvatar from "./handler";

export const UserSaveAvatar = new Elysia()
  .use(AuthPlugin)
  .post('/userSaveAvatar', ({
    Auth: {
      user: {localUserId}
    }, body: {
      avatarId
    }}) => userSaveAvatar(localUserId, avatarId), {
    detail: {
      tags: ['market']
    },
    body: t.Object({
      avatarId: t.Numeric()
    })
  })
