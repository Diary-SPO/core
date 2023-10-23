import { Snackbar } from '@vkontakte/vkui'
import { Icon28ErrorCircleOutline } from '@vkontakte/icons'
import { useState } from 'preact/hooks'
import { ReactNode } from 'preact/compat'

const useRateLimitExceeded = (): [ReactNode | null, () => void] => {
  const [rateSnackbar, setRateSnackbar] = useState<ReactNode | null>(null)

  const handleRateLimitExceeded = () => {
    setRateSnackbar(
      <Snackbar
        layout="vertical"
        onClose={() => setRateSnackbar(null)}
        before={
          <Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />
        }
        subtitle="Вы временно заблокированы. Если вы считаете, что это ошибка, то сообщите нам"
      >
        Слишком частые запросы
      </Snackbar>
    )
  }

  return [rateSnackbar, handleRateLimitExceeded]
}

export default useRateLimitExceeded
