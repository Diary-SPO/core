import { Icon28ErrorCircleOutline } from '@vkontakte/icons'
import { createElement } from 'preact'
import { SnackbarData } from '../hooks/useSnackbar'

/**
 * Функция 'handleResponse' обрабатывает различные сценарии ответа после запроса.
 * Принимает response и выполняет соответствующие коллбэки в зависимости от полученного ответа.
 * Если response равен 418, создает и отображает иконку ошибки и сообщение о возникшей ошибке.
 * При наличии showSnackbar, вызывает его с данными для Snackbar.
 * Затем выполняет коллбэки errorCallback и loadingCallback, завершая выполнение функции.
 * Если response равен 429, вызывает коллбэк limitExceededCallback и errorCallback, затем loadingCallback.
 */

export const handleResponse = <T>(
  response: T,
  errorCallback: () => void,
  limitExceededCallback: () => void,
  loadingCallback: (isLoading: boolean) => void,
  showSnackbar?: (snackbarData: SnackbarData) => void
): void => {
  if (response === 418) {
    const errorIcon = createElement(Icon28ErrorCircleOutline, {
      fill: 'var(--vkui--color_icon_negative)',
    })
    if (showSnackbar) {
      showSnackbar({
        icon: errorIcon,
        title: 'Ошибка при попытке сделать запрос',
        subtitle: 'Попробуйте обновить страницу или обновите куки в настройках',
      })
    }
    loadingCallback(false)
    errorCallback()
    return
  }

  if (response === 429) {
    limitExceededCallback()
    errorCallback()
    loadingCallback(false)
  }
}
