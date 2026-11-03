import { appIcon } from '@runtime-api'
import {
  Icon28MoonOutline,
  Icon28PaletteOutline,
  Icon28ViewOutline
} from '@vkontakte/icons'
import {
  FormItem,
  Group,
  Header,
  NativeSelect,
  Panel,
  SimpleCell,
  Switch
} from '@vkontakte/vkui'
import { type ChangeEvent, type FC, useEffect, useState } from 'react'
import { PanelHeaderWithBack } from '../../../shared'
import type { AppIconOption } from '../../../shared/api/runtime/types.ts'
import {
  ACCENT_OPTIONS,
  type AccentId,
  getTabbarLabelsVisible,
  setTabbarLabelsVisible
} from '../../../shared/config'
import { useSnackbar } from '../../../shared/hooks'
import type { Props } from '../../types.ts'
import {
  getAccentPreference,
  getOledPreference,
  getThemePreference,
  setAccentPreference,
  setOledPreference,
  setThemePreference,
  THEME_LABELS,
  type ThemePreference
} from '../shared/theme'
import AccentGrid from './AccentGrid'
import AppIconGrid from './AppIconGrid'

const AppearanceSettings: FC<Props> = ({ id }) => {
  const [theme, setTheme] = useState<ThemePreference>(getThemePreference)
  const [oled, setOled] = useState(getOledPreference)
  const [accent, setAccent] = useState<AccentId>(getAccentPreference)
  const [showLabels, setShowLabels] = useState(getTabbarLabelsVisible)
  const [iconSupported, setIconSupported] = useState(appIcon.supported)
  const [iconOptions, setIconOptions] = useState<AppIconOption[]>([])
  const [iconId, setIconId] = useState('default')
  const [snackbar, showSnackbar] = useSnackbar()

  useEffect(() => {
    if (!appIcon.supported) return
    void (async () => {
      try {
        const [options, current] = await Promise.all([
          appIcon.getOptions(),
          appIcon.getCurrent()
        ])
        setIconOptions(options)
        setIconId(current)
        setIconSupported(options.length > 0)
      } catch (error) {
        console.warn('Unable to load app icons', error)
        setIconSupported(false)
      }
    })()
  }, [])

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const preference = event.currentTarget.value as ThemePreference
    setTheme(preference)
    setThemePreference(preference)
  }

  const handleOledChange = (checked: boolean) => {
    setOled(checked)
    setOledPreference(checked)
  }

  const handleAccentChange = (next: AccentId) => {
    setAccent(next)
    setAccentPreference(next)
  }

  const handleLabelsChange = (checked: boolean) => {
    setShowLabels(checked)
    setTabbarLabelsVisible(checked)
  }

  const handleIconChange = async (next: string) => {
    if (next === iconId) return
    const previous = iconId
    setIconId(next)
    try {
      setIconId(await appIcon.setIcon(next))
      showSnackbar({
        title: 'Иконка изменена',
        subtitle: 'На части устройств ярлык обновится через пару секунд'
      })
    } catch (error) {
      console.error('Unable to change app icon', error)
      setIconId(previous)
      showSnackbar({
        title: 'Не удалось сменить иконку',
        subtitle: 'Попробуйте позже'
      })
    }
  }

  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title='Оформление' />
      <Group header={<Header size='s'>Тема</Header>}>
        <FormItem top='Тема приложения'>
          <NativeSelect
            before={<Icon28PaletteOutline />}
            value={theme}
            onChange={handleThemeChange}
          >
            {(Object.keys(THEME_LABELS) as ThemePreference[]).map((value) => (
              <option key={value} value={value}>
                {THEME_LABELS[value]}
              </option>
            ))}
          </NativeSelect>
        </FormItem>
        <SimpleCell
          before={<Icon28MoonOutline />}
          after={
            <Switch
              checked={oled}
              onChange={(event) =>
                handleOledChange(event.currentTarget.checked)
              }
            />
          }
          subtitle='Чёрный фон в тёмной и автоматической теме'
          multiline
        >
          OLED в тёмной теме
        </SimpleCell>
      </Group>

      <Group header={<Header size='s'>Акцент</Header>}>
        <FormItem top='Цвет кнопок и выделений'>
          <AccentGrid
            options={ACCENT_OPTIONS}
            value={accent}
            onChange={handleAccentChange}
          />
        </FormItem>
      </Group>

      <Group header={<Header size='s'>Навигация</Header>}>
        <SimpleCell
          before={<Icon28ViewOutline />}
          after={
            <Switch
              checked={showLabels}
              onChange={(event) =>
                handleLabelsChange(event.currentTarget.checked)
              }
            />
          }
          subtitle='Подписи вкладок Главная, Успеваемость и других'
          multiline
        >
          Подписи в нижней панели
        </SimpleCell>
      </Group>

      {iconSupported && iconOptions.length > 0 && (
        <Group header={<Header size='s'>Иконка приложения</Header>}>
          <FormItem
            top='Значок на рабочем столе'
            bottom='Меняется сам значок на рабочем столе. Иногда ярлык обновляется с задержкой.'
          >
            <AppIconGrid
              options={iconOptions}
              value={iconId}
              onChange={(next) => void handleIconChange(next)}
            />
          </FormItem>
        </Group>
      )}
      {snackbar}
    </Panel>
  )
}

export default AppearanceSettings
