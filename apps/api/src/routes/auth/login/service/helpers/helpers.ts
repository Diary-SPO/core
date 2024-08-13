import { API_CODES, UnauthorizedError } from '@api'
import type { ApiResponse } from '@utils'

/** Обрабатывает ответ от сервера **/
export const handleResponse = <T>(
  res: number | ApiResponse<T>
): ApiResponse<T> | 'DOWN' | 'UNKNOWN' => {
  if (typeof res !== 'number') {
    return res
  }

  /** Неправильные данные для авторизации **/
  if (res === API_CODES.UNAUTHORIZED) {
    throw new UnauthorizedError('Invalid data')
  }

  /** Сетевой город упал. Пробуем найти юзера в нашей базе **/
  if (res > API_CODES.UNAUTHORIZED) {
    return 'DOWN'
  }

  return 'UNKNOWN'
}
