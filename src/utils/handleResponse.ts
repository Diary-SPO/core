import { Icon28ErrorCircleOutline } from '@vkontakte/icons'
import { createElement } from 'preact'
import { SnackbarData } from '../hooks/useSnackbar'

/**
 * Функция 'handleResponse' обрабатывает различные негативные сценарии ответа после запроса.
 * Принимает response и выполняет соответствующие коллбэки в зависимости от полученного ответа.
 */

export const handleResponse = <T>(
  response: T,
  errorCallback: () => void,
  limitExceededCallback: () => void,
  loadingCallback: (isLoading: boolean) => void,
  showSnackbar?: (snackbarData: SnackbarData) => void
): void => {
  /**
   * Если нам пришел ответ от сервера с ошибкой
   *
   * P.S. В "хорошем" ответе нет поля status, а толкьо нужные данные
   */
  if (!(response instanceof Response) || !('status' in response)) {
    return
  }

  /** Ошибка авторизации */
  if (response.status === 418) {
    const errorIcon = createElement(Icon28ErrorCircleOutline, {
      fill: 'var(--vkui--color_icon_negative)'
    })

    if (showSnackbar) {
      showSnackbar({
        icon: errorIcon,
        title: 'Ошибка при попытке сделать запрос',
        subtitle: 'Попробуйте обновить страницу или обновите куки в настройках'
      })
    }
  }
  
  /** Rate limit */
  if (response.status === 429) {
    limitExceededCallback()
  }

  /** Любая другая ошибка (500 и тд) **/
  loadingCallback(false)
  errorCallback()
}
