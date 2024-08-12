import { Elysia } from 'elysia'

import { API_CODES } from '@api'

import { AdsController } from './ads'
import { AttestationController } from './attestation'
import { AuthController } from './auth'
import { FinalMarksController } from './finalMarks'
import { HomeController } from './home'
import { LessonsController } from './lessons'
import { OrganizationController } from './organization'
import { PerformanceCurrentController } from './performance.current'

export const routes = new Elysia()
  .use(HomeController)
  .use(AuthController)
  .use(OrganizationController)
  .use(LessonsController)
  .use(AdsController)
  .use(AttestationController)
  .use(FinalMarksController)
  .use(PerformanceCurrentController)
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
