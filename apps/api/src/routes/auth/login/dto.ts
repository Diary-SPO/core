import { Elysia, t } from 'elysia'

export const AuthModel = new Elysia({ name: 'Model.Auth' }).model({
  'auth.sign': t.Object({
    login: t.String(),
    isHash: t.Boolean(),
    password: t.String({
      minLength: 5
    })
  })
})
