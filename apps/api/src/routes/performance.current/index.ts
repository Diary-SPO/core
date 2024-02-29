import { Elysia } from 'elysia'
import getPerformanceCurrent from './handler'

const performanceCurrent = new Elysia().get(
  '/performance.current/',
  getPerformanceCurrent,
  {
    detail: {
      tags: ['Student']
    }
  }
)

export default performanceCurrent
