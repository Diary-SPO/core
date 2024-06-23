import { UnauthorizedError } from '@api'
import { getCookieFromToken } from '@helpers'
import { Elysia } from 'elysia'

export const AuthService = new Elysia({ name: 'Service.Auth' })
  .derive({ as: 'scoped' }, async ({ headers: { secret } }) => {
    if (!secret) throw new UnauthorizedError()

    return {
      Auth: {
        user: await getCookieFromToken(secret)
      }
    }
  })
  .macro(({ onBeforeHandle }) => ({
    isSignIn(value: boolean) {
      onBeforeHandle(({ Auth, error }) => {
        if (!Auth?.user) return error(401)
      })
    }
  }))

export const AuthPlugin = new Elysia().use(AuthService).guard({
  isSignIn: true
})
