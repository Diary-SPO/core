import { backgroundGradeNotifications } from '@runtime-api'
import { Icon28Notifications } from '@vkontakte/icons'
import {
  FormItem,
  Group,
  Header,
  NativeSelect,
  SimpleCell,
  Switch
} from '@vkontakte/vkui'
import { type ChangeEvent, useState } from 'react'

import {
  BACKGROUND_GRADE_INTERVALS,
  type BackgroundGradeInterval
} from '../../shared/api/runtime/types.ts'
import { useSnackbar } from '../../shared/hooks'

const intervalLabels: Record<BackgroundGradeInterval, string> = {
  15: 'Каждые 15 минут',
  30: 'Каждые 30 минут',
  60: 'Каждый час',
  120: 'Каждые 2 часа'
}

interface GradeNotificationsProps {
  compact?: boolean
}

const GradeNotifications = ({ compact = false }: GradeNotificationsProps) => {
  const [snackbar, showSnackbar] = useSnackbar()
  const [settings, setSettings] = useState(() =>
    backgroundGradeNotifications.getSettings()
  )

  if (!backgroundGradeNotifications.supported) return null

  const updateEnabled = async (enabled: boolean) => {
    const previousSettings = settings
    setSettings({ ...settings, enabled })

    try {
      setSettings(
        await backgroundGradeNotifications.setSettings({
          ...settings,
          enabled
        })
      )
    } catch (error) {
      setSettings(previousSettings)
      showSnackbar({
        title: enabled ? 'Не включилось' : 'Не выключилось',
        subtitle: error instanceof Error ? error.message : 'Неизвестная ошибка'
      })
    }
  }

  const updateInterval = async (event: ChangeEvent<HTMLSelectElement>) => {
    const intervalMinutes = Number(event.currentTarget.value) as
      | BackgroundGradeInterval
      | undefined
    if (!intervalMinutes) return

    const previousSettings = settings
    setSettings({ ...settings, intervalMinutes })

    try {
      setSettings(
        await backgroundGradeNotifications.setSettings({
          ...settings,
          intervalMinutes
        })
      )
    } catch (error) {
      setSettings(previousSettings)
      showSnackbar({
        title: 'Не удалось сменить частоту',
        subtitle: error instanceof Error ? error.message : 'Неизвестная ошибка'
      })
    }
  }

  const selectValue = BACKGROUND_GRADE_INTERVALS.includes(
    settings.intervalMinutes
  )
    ? settings.intervalMinutes
    : 30

  const toggle = (
    <SimpleCell
      multiline
      before={<Icon28Notifications />}
      after={
        <Switch
          checked={settings.enabled}
          onChange={(event) => updateEnabled(event.currentTarget.checked)}
        />
      }
      subtitle='Проверять оценки в фоне и показывать уведомления'
    >
      Уведомления об оценках
    </SimpleCell>
  )

  if (compact) {
    return (
      <>
        {toggle}
        {snackbar}
      </>
    )
  }

  return (
    <Group header={<Header size='s'>Оценки</Header>}>
      {toggle}
      <FormItem
        hidden={!settings.enabled}
        top='Частота проверки'
        bottom='С 20:00 до 06:00 раз в 2 часа. Из-за экономии батареи может приходить с задержкой.'
      >
        <NativeSelect
          disabled={!settings.enabled}
          value={selectValue}
          onChange={updateInterval}
        >
          {BACKGROUND_GRADE_INTERVALS.map((interval) => (
            <option key={interval} value={interval}>
              {intervalLabels[interval]}
            </option>
          ))}
        </NativeSelect>
      </FormItem>
      {snackbar}
    </Group>
  )
}

export default GradeNotifications
