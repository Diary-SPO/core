import { Elysia } from 'elysia'
import { AuthPlugin } from '../../services/AuthService'
import { getPerformanceCurrent } from './handler'

export const PerformanceCurrentController = new Elysia().use(AuthPlugin).get(
  '/performanceCurrent',
  ({
    Auth: {
      user: { token }
    }
  }) => getPerformanceCurrent({ token }),
  {
    detail: {
      tags: ['Current Performance']
    }
  }
)
