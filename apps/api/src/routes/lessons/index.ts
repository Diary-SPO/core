import { Elysia, t } from 'elysia'
import getLessons from './handler'

const lessons = new Elysia().post('/lessons/', getLessons, {
  detail: {
    tags: ['Student']
  },
  body: t.Object({
    endDate: t.RegExp(/^\d{4}-\d{2}-\d{2}$/),
    startDate: t.RegExp(/^\d{4}-\d{2}-\d{2}$/)
  })
})

export default lessons
