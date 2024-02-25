import { Elysia } from 'elysia'

import ads from './ads'
import attestation from './attestation'
import finalMarks from './finalMarks'
import hello from './hello'
import lessons from './lessons'
import login from './login'
import organization from './organization'
import performanceCurrent from './performance.current'
import oauthGitHub from './oauth/github'

import { headersSchema } from '@utils'
import { errorHandler } from './helpers'

export const routes = new Elysia()
  /** Роуты с проверкой на наличие secret поля **/
  .guard(headersSchema, (app) =>
    app
      .use(organization)
      .use(lessons)
      .use(performanceCurrent)
      .use(attestation)
      .use(ads)
      .use(finalMarks)
  )
  /** Роуты без проверки **/
  .use(hello)
  .use(login)
  /** Обработка любых ошибок в кажом роуте **/
  .onError(errorHandler)

export const adminRoutes = new Elysia()
  .use(oauthGitHub)
  /** Обработка любых ошибок в кажом роуте **/
  .onError(errorHandler)

