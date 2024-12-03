import { Elysia, t } from 'elysia'
import { AuthPlugin } from '../../services/AuthService'
import getLessons from './handler'
import getMarketAvatars from "./handler";

export const MarketAvatars = new Elysia()
  .use(AuthPlugin)
  .get(
    '/marketAvatars/:page',
    ({ params: { page }, Auth: { user } }) =>
      getMarketAvatars({page}),
    {
      params: t.Object({
        page: t.Numeric({minimum: 1, maximum: 999})
      })
    }
  )
