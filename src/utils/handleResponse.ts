import { Icon28ErrorCircleOutline } from '@vkontakte/icons'
import { createElement } from 'preact'
import { SnackbarData } from '../hooks/useSnackbar'
import { HTTP_STATUSES } from '../types'

/**
 * Функция 'handleResponse' обрабатывает различные негативные сценарии ответа после запроса.
 * Принимает response и выполняет соответствующие коллбэки в зависимости от полученного ответа.
 */

export const handleResponse = <T extends object>(
  response: Response | T,
  errorCallback?: () => void,
  limitExceededCallback?: () => void,
  loadingCallback?: (isLoading: boolean) => void,
  showSnackbar?: (snackbarData: SnackbarData) => void
): undefined | T => {
  console.log('%c[handleResponse]', 'color: green', response)

  /**
   * Если нам пришел ответ от сервера с ошибкой
   *
   * P.S. В "хорошем" ответе нет поля status, а только нужные данные
   */
  if (!(response instanceof Response) && !('status' in response)) {
    return response
  }

  console.log('%c[handleResponse]', 'color: violet', response.status)

  switch (response.status) {
    case HTTP_STATUSES.RATE_LIMIT:
      limitExceededCallback()
      break
    case HTTP_STATUSES.TEAPOT: {
      const errorIcon = createElement(Icon28ErrorCircleOutline, {
        fill: 'var(--vkui--color_icon_negative)'
      })

      showSnackbar?.({
        before: errorIcon,
        title: 'Ошибка при попытке сделать запрос',
        subtitle: 'Попробуйте обновить страницу или перезайти в аккаунт'
      })
      break
    }
    default: {
      errorCallback()
      break
    }
  }

  loadingCallback(false)
  return
}
