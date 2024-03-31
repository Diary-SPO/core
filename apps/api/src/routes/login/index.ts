import { Elysia, t } from 'elysia'
import postAuth from './handler'

const schema = {
  body: t.Object({
    login: t.String(),
    password: t.String(),
    isHash: t.Boolean()
  })
}

const performanceCurrent = new Elysia().guard(schema, (app) =>
  app.post('/login', postAuth, {
    detail: {
      tags: ['Auth']
    }
  })
)

export default performanceCurrent
