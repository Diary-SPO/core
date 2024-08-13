import type { Nullable } from '@diary-spo/shared'
import { Icon28ErrorCircleOutline } from '@vkontakte/icons'
import { Snackbar } from '@vkontakte/vkui'
import { type ReactNode, useCallback, useState } from 'preact/compat'
import { VKUI_RED } from '../config'

/**
 * Функция 'useRateLimitExceeded' обрабатывает случай превышения лимита запросов.
 * Устанавливает Snackbar для сообщения об ошибке о превышении лимита запросов.
 * При вызове функции handleRateLimitExceeded устанавливает Snackbar с соответствующим сообщением и иконкой.
 * Возвращает состояние rateSnackbar и функцию handleRateLimitExceeded для управления Snackbar'ом.
 */

export const useRateLimitExceeded = (): [Nullable<ReactNode>, () => void] => {
  const [rateSnackbar, setRateSnackbar] = useState<Nullable<ReactNode>>(null)

  const handleRateLimitExceeded = useCallback(() => {
    setRateSnackbar(
      <Snackbar
        layout='vertical'
        onClose={() => setRateSnackbar(null)}
        before={<Icon28ErrorCircleOutline fill={VKUI_RED} />}
        subtitle='Вы временно заблокированы. Если вы считаете, что это ошибка, то сообщите нам'
      >
        Слишком частые запросы
      </Snackbar>
    )
  }, [])

  return [rateSnackbar, handleRateLimitExceeded]
}
