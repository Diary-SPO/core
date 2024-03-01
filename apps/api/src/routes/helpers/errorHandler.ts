import { API_CODES, API_ERRORS, BASE_API_ERRORS } from '@api'
import { error as errorLog } from '@utils'
import { ErrorHandler } from 'elysia'

export const errorHandler: ErrorHandler = ({ set, code, error, path }) => {
  errorLog(error)
  errorLog(error.message)
  errorLog(code)

  switch (code) {
    case API_CODES.UNAUTHORIZED:
      if (error.message === API_ERRORS.INVALID_TOKEN) {
        set.status = API_CODES.UNAUTHORIZED
        return {
          message: API_ERRORS.INVALID_TOKEN,
          code: API_CODES.UNAUTHORIZED,
          path
        }
      }

      if (error.message === API_ERRORS.USER_NOT_PERMISSION) {
        set.status = API_CODES.FORBIDDEN
        return {
          message: API_ERRORS.USER_NOT_PERMISSION,
          code: API_CODES.FORBIDDEN,
          path
        }
      }
      break
    case API_CODES.FORBIDDEN:
      if (error.message !== API_ERRORS.USER_NOT_PERMISSION) {
        errorLog('Unhandled forbidden error', error.message)
        break
      }

      set.status = API_CODES.FORBIDDEN
      return {
        message: API_ERRORS.USER_NOT_PERMISSION,
        code: API_CODES.FORBIDDEN,
        path
      }
    case API_CODES.NOT_FOUND:
      set.status = API_CODES.NOT_FOUND
      return {
        message: BASE_API_ERRORS.NOT_FOUND,
        code: API_CODES.NOT_FOUND,
        path
      }
    case API_CODES.INTERNAL_SERVER_ERROR:
      if (error.message !== API_ERRORS.DATA_NOT_FOUND) {
        errorLog('Unhandled internal error', error.message)
        break
      }

      set.status = API_CODES.INTERNAL_SERVER_ERROR
      return {
        message: API_ERRORS.DATA_NOT_FOUND,
        code: API_CODES.INTERNAL_SERVER_ERROR,
        path
      }
    case BASE_API_ERRORS.NOT_FOUND:
      set.status = API_CODES.NOT_FOUND
      return {
        message: BASE_API_ERRORS.NOT_FOUND,
        code: API_CODES.NOT_FOUND,
        path
      }
    case BASE_API_ERRORS.VALIDATION:
      try {
        const formattedError = JSON.parse(error.message)
        set.status = API_CODES.BAD_REQUEST
        return {
          message: BASE_API_ERRORS.VALIDATION,
          code: API_CODES.BAD_REQUEST,
          errors: formattedError.errors,
          path
        }
      } catch (error) {
        errorLog('Found validation parse error', error.message)

        return {
          message: API_ERRORS.PARSE_ERROR,
          code: API_CODES.BAD_REQUEST,
          errors: formattedError.errors,
          path
        }
      }
    case BASE_API_ERRORS.INTERNAL_SERVER_ERROR:
      set.status = API_CODES.INTERNAL_SERVER_ERROR
      return {
        message: BASE_API_ERRORS.INTERNAL_SERVER_ERROR,
        code: API_CODES.INTERNAL_SERVER_ERROR,
        path
      }
    default:
      set.status = API_CODES.UNKNOWN_ERROR
      return { message: 'Unknown error', code: API_CODES.UNKNOWN_ERROR, path }
  }
}
