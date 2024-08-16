import { Icon28ErrorCircleOutline } from '@vkontakte/icons'
import { VKUI_RED } from '../../config'
import type { SnackbarData } from '../../hooks'
import { HTTP_STATUSES } from '../../types.ts'
import { isApiError } from '../isApiError'

/**
 * Функция 'handleResponse' обрабатывает различные негативные сценарии ответа после запроса.
 * Принимает response и выполняет соответствующие коллбэки в зависимости от полученного ответа.
 */

const errorIcon = <Icon28ErrorCircleOutline fill={VKUI_RED} />

export const handleResponse = <T extends object>(
  /** Ответ от сервера **/
  response: T,
  /** Функция, вызываемая при ошибке **/
  errorCallback?: () => void,
  /** Функция, вызываемая достижении rate limit **/
  limitExceededCallback?: () => void,
  /** Функция, вызываемая для отмены загрузки **/
  loadingCallback?: (isLoading: boolean) => void,
  /** Функция, вызываемая для создания снекбара **/
  showSnackbar?: (snackbarData: SnackbarData) => void,
  /** Надо ли вызывать errorCallback при 520 ошибке **/
  shouldCallErrorIfFatal = true,
  /** Надо ли вызывать errorCallback при 401 ошибке **/
  shouldCallErrorIfUnauth = false
): T | undefined => {
  console.log('%c[handleResponse]', 'color: green', response)

  if (!response) {
    showSnackbar?.({
      before: errorIcon,
      title: 'Ошибка при попытке сделать запрос',
      subtitle: 'Сообщите нам о проблеме'
    })
  }

  /**
   * Если нам пришел ответ от сервера с ошибкой
   *
   * P.S. В "хорошем" ответе нет поля error, а только нужные данные
   */
  if (!isApiError(response)) {
    loadingCallback?.(false)
    return response
  }

  console.log('%c[handleResponse]', 'color: violet', response.status)

  switch (response.status) {
    case HTTP_STATUSES.RATE_LIMIT:
      limitExceededCallback?.()
      break
    case HTTP_STATUSES.UNAUTHORIZED:
      if (shouldCallErrorIfUnauth) {
        errorCallback?.()
        break
      }

      localStorage.clear()
      showSnackbar?.({
        before: errorIcon,
        title: 'Ошибка при попытке сделать запрос',
        subtitle: 'Перезайдите в аккаунт'
      })
      break
    case HTTP_STATUSES.TEAPOT: {
      if (shouldCallErrorIfFatal) {
        errorCallback?.()
      }

      showSnackbar?.({
        before: errorIcon,
        title: 'Ошибка при попытке сделать запрос',
        subtitle: 'Сообщите нам о проблеме'
      })
      break
    }
    default: {
      errorCallback?.()
      break
    }
  }

  loadingCallback?.(false)
}
