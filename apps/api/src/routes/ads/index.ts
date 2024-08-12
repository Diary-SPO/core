import { Elysia } from 'elysia'
import { AuthPlugin } from '../../services/AuthService'
import { getAds } from './handler'

export const AdsController = new Elysia().use(AuthPlugin).get(
  '/ads',
  ({
    Auth: {
      user: { spoId, token }
    }
  }) => getAds({ token, spoId }),
  {
    detail: {
      tags: ['Ads']
    }
  }
)
