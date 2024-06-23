import { Elysia } from 'elysia'
import { AuthPlugin, AuthService } from '../../services/AuthService'
import getOrganization from './handler'

const organization = new Elysia()
  .use(AuthService)
  .guard({
    isSignIn: true
  })
  .get(
    '/organization',
    ({
      Auth: {
        user: { localUserId, cookie }
      }
    }) => getOrganization({ userId: localUserId, cookie }),
    {
      detail: {
        tags: ['Organization']
      }
    }
  )

export default organization
