import { VKUI_ACCENT_BG } from '@config'
import { Icon28InfoCircleOutline } from '@vkontakte/icons'
import { Snackbar, SnackbarProps } from '@vkontakte/vkui'
import { ReactNode } from 'preact/compat'
import { useCallback, useState } from 'preact/hooks'
import { Nullable } from '@types'

/**
 * Функция 'useSnackbar' управляет отображением Snackbar'а для уведомлений.
 * Предоставляет метод 'showSnackbar', который позволяет отображать уведомления на основе переданных данных.
 * Возвращает состояние 'snackbar', отображающее текущий Snackbar, и функцию 'showSnackbar' для управления им.
 * 'showSnackbar' принимает 'snackbarData' (данные для Snackbar) и отображает Snackbar с соответствующими свойствами.
 * Если передан null в качестве 'snackbarData', закрывает Snackbar, в противном случае отображает новый Snackbar с заданными данными.
 */

export type SnackbarData = Partial<SnackbarProps>

export const useSnackbar = (): [
  Nullable<ReactNode>,
  (snackbarData: Nullable<SnackbarData>) => void
] => {
  const [snackbar, setSnackbar] = useState<Nullable<ReactNode>>(null)

  const showSnackbar = useCallback((snackbarData: Nullable<SnackbarData>) => {
    if (!snackbarData) {
      setSnackbar(null)
      return null
    }

    setSnackbar(
      <Snackbar
        offsetY={45}
        layout={snackbarData.layout || 'vertical'}
        onClose={() => setSnackbar(null)}
        before={
          snackbarData.before || (
            <Icon28InfoCircleOutline fill={VKUI_ACCENT_BG} />
          )
        }
        action={snackbarData.action}
        onActionClick={snackbarData.onActionClick}
        duration={snackbarData.duration}
        style={snackbarData.style}
        subtitle={snackbarData.subtitle}
      >
        {snackbarData.title}
      </Snackbar>
    )

    return null
  }, [])

  return [snackbar, showSnackbar]
}
