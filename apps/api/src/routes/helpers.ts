import { API_CODES, API_ERRORS } from '@api'
import { error as errorLog } from '@utils'
import { ErrorHandler } from 'elysia'

interface ErrorResponse {
  code: number
  message: string
  path: string
  errors?: unknown[]
}

export const errorHandler: ErrorHandler = ({
  set,
  code,
  error,
  path
}): ErrorResponse => {
  errorLog(error.message)

  /**
   * Обработка ошибки от ApiError
   **/

  /** Токен юзера был удалён или он отправил не валидный **/
  if (
    Number(code) === API_CODES.UNAUTHORIZED &&
    error.message === API_ERRORS.INVALID_TOKEN
  ) {
    set.status = API_CODES.UNAUTHORIZED
    return {
      message: API_ERRORS.INVALID_TOKEN,
      code: API_CODES.UNAUTHORIZED,
      path
    }
  }

  /** Не валидные данные для авторизации **/
  if (Number(code) === API_CODES.UNAUTHORIZED) {
    set.status = API_CODES.UNAUTHORIZED
    return {
      message: 'INVALID_DATA',
      code: API_CODES.UNAUTHORIZED,
      path
    }
  }

  /**
   * Обработка дефолтных ошибок
   **/

  if (code === 'NOT_FOUND') {
    return {
      message: 'NOT_FOUND',
      code: API_CODES.NOT_FOUND,
      path
    }
  }

  const formattedError = JSON.parse(error.message)

  /** Не валидные данные в теле запроса **/
  if (code === 'VALIDATION') {
    return {
      message: code,
      code: API_CODES.BAD_REQUEST,
      errors: formattedError.errors,
      path
    }
  }

  if (code === 'INTERNAL_SERVER_ERROR') {
    return {
      message: code,
      code: API_CODES.INTERNAL_SERVER_ERROR,
      path
    }
  }

  set.status = API_CODES.UNKNOWN_ERROR
  return {
    message: 'Unknown error',
    code: API_CODES.UNKNOWN_ERROR,
    path
  }
}
