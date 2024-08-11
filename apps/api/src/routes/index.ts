import { Elysia, t } from 'elysia'

import { API_CODES } from '@api'
import { AuthService } from '../services/AuthService'
import { getServerInfo } from './hello/helpers'
import getLessons from './lessons/handler'
import postAuth from './login/handler'
import getOrganization from './organization/handler'

const AuthModel = new Elysia({ name: 'Model.Auth' }).model({
  'auth.sign': t.Object({
    login: t.String(),
    isHash: t.Boolean(),
    password: t.String({
      minLength: 5
    })
  })
})

const AuthController = new Elysia({ prefix: '/auth' })
  .use(AuthModel)
  .post(
    '/login',
    ({ body: { login, password, isHash } }) =>
      postAuth({ login, password, isHash }),
    {
      detail: {
        tags: ['Auth']
      },
      body: 'auth.sign'
    }
  )

export const routes = new Elysia()
  // /** Роуты без проверки **/
  .get('/', async () => await getServerInfo(), {
    detail: {
      tags: ['Home']
    }
  })
  .use(AuthController)
  //
  .use(AuthService)
  .guard({
    isSignIn: true
  })
  // .use(organization)
  // .use(lessons)
  .get(
    '/organization',
    ({
      Auth: {
        user: { localUserId, cookie }
      }
    }) => getOrganization({ userId: localUserId, cookie }),
    {
      detail: {
        tags: ['Organization']
      }
    }
  )
  .get(
    '/lessons/:startDate/:endDate',
    ({ params: { startDate, endDate }, Auth: { user } }) =>
      getLessons({ startDate, endDate, user }),
    {
      detail: {
        tags: ['Lessons']
      }
    }
  )

  // .use(performanceCurrent)
  // .use(attestation)
  // .use(ads)
  // .use(finalMarks)
  // .use(logout)

  /** Обработка любых ошибок в кажом роуте **/
  .onError(({ set, code, path, error }) => {
    if (Number(code)) {
      set.status = Number(code)
    }

    /** Не валидные данные в теле запроса **/
    if (code === 'VALIDATION') {
      const formattedError = JSON.parse(error.message)

      return {
        message: code,
        code: API_CODES.BAD_REQUEST,
        errors: formattedError.errors,
        path
      }
    }

    return { path, message: error.message, code: code }
  })
