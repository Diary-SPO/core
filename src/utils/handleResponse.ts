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
  showSnackbar?: (snackbarData: SnackbarData) => void,
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
    return
  }
}
