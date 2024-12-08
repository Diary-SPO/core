import { Elysia } from 'elysia'
import { AuthPlugin } from '../../../services/AuthService'
import getMarketAvatars from './handler'

export const MarketAvatars = new Elysia()
  .use(AuthPlugin)
  .get('/marketAvatars', () => getMarketAvatars(), {
    detail: {
      tags: ['market']
    }
  })
