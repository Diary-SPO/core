import { Elysia } from 'elysia'
import { AuthService } from '../../services/AuthService'
import getOrganization from './handler'

export const OrganizationController = new Elysia()
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
