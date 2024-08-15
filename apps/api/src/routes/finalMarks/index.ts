import { Elysia } from 'elysia'
import { AuthPlugin } from '../../services/AuthService'
import getFinalMarks from './handler'

export const FinalMarksController = new Elysia().use(AuthPlugin).get(
  '/finalMarks',
  ({
    Auth: {
      user: { token }
    }
  }) => getFinalMarks({ token }),
  {
    detail: {
      tags: ['Student']
    }
  }
)
