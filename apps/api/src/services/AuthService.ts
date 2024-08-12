import { Elysia } from 'elysia'

import { UnauthorizedError } from '@api'
import { getCookieFromToken } from '@helpers'

/**
 * export const AuthService = new Elysia({ name: 'Service.Auth' })
 *   .derive({ as: 'scoped' }, async ({ headers: { secret } }) => {
 *     if (!secret) throw new UnauthorizedError()
 *
 *     return {
 *       Auth: {
 *         user: await getCookieFromToken(secret)
 *       }
 *     }
 *   })
 *   .macro(({ onBeforeHandle }) => ({
 *     isSignIn() {
 *       onBeforeHandle(({ Auth, error }) => {
 *         if (!Auth?.user) return error(401)
 *       })
 *     }
 *   }))
 *
 * macro позволяет внедрить свое поле в контекст и выполнять логику перед обработкой запроса
 * В данный момент я не вижу смысла, нам хватит и обычного плагина для этого, потому что доп. функции не используются
 *
 * @see https://elysiajs.com/patterns/macro.html#macro
 */

export const AuthPlugin = new Elysia().derive(
  { as: 'scoped' },
  async ({ headers: { secret } }) => {
    if (!secret) throw new UnauthorizedError()

    return {
      Auth: {
        user: await getCookieFromToken(secret)
      }
    }
  }
)
