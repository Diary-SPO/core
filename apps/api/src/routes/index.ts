import { Elysia, t } from 'elysia'

import ads from './ads'
import attestation from './attestation'
import finalMarks from './finalMarks'
import hello from './hello'
import lessons from './lessons'
import login from './login'
import logout from './logout'
import organization from './organization'
import performanceCurrent from './performance.current'

import { API_CODES } from '@api'
import { AuthService } from '../services/AuthService'
import getOrganization from './organization/handler'

export const routes = new Elysia()
  .use(AuthService)
  .guard({
    isSignIn: true
  })
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
  // .use(organization)
  // .use(lessons)
  // .use(performanceCurrent)
  // .use(attestation)
  // .use(ads)
  // .use(finalMarks)
  // .use(logout)

  // /** Роуты без проверки **/
  // .use(hello)
  // .use(login)

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
