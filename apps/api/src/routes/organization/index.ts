import { Elysia } from 'elysia'
import { AuthPlugin } from '../../services/AuthService'
import getOrganization from './handler'

export const OrganizationController = new Elysia()
  .use(AuthPlugin)

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
