import { Elysia, t } from 'elysia'
import getFinalMarks from './handler'

const schema = {
  params: t.Object({
    id: t.String()
  })
}

const finalMarks = new Elysia().guard(schema, (app) =>
  app.get('/final.marks/:id', getFinalMarks, {
    detail: {
      tags: ['Student']
    }
  })
)

export default finalMarks
