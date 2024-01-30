import { Elysia } from 'elysia'
import getPerformanceCurrent from './handler'

const performanceCurrent = new Elysia().get(
  '/performance.current/:id',
  getPerformanceCurrent,
  {
    detail: {
      tags: ['Student']
    }
  }
)

export default performanceCurrent
