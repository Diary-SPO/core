import { Elysia, t } from 'elysia'
import getLessons from './handler'

const schema = {
  params: t.Object({
    endDate: t.RegExp(/^\d{4}-\d{2}-\d{2}$/),
    startDate: t.RegExp(/^\d{4}-\d{2}-\d{2}$/)
  })
}

const lessons = new Elysia().guard(schema, (app) =>
  app.get('/lessons/:startDate/:endDate', getLessons, {
    detail: {
      tags: ['Student']
    }
  })
)

export default lessons
