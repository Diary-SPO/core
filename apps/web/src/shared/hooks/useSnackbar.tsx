import type { Nullable } from '@diary-spo/shared'
import { Icon28InfoCircleOutline } from '@vkontakte/icons'
import { Snackbar, type SnackbarProps } from '@vkontakte/vkui'
import { type ReactNode, useCallback, useState } from 'react'

import { VKUI_ACCENT_BG } from '../config'

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
        layout={snackbarData.layout || 'vertical'}
        onClose={() => setSnackbar(null)}
        before={
          snackbarData.before || (
            <Icon28InfoCircleOutline fill={VKUI_ACCENT_BG} />
          )
        }
        offsetY={50}
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
