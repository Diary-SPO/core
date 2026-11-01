import { appIcon } from '@runtime-api'
import { Icon28PaletteOutline, Icon28ViewOutline } from '@vkontakte/icons'
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
  getTabbarLabelsVisible,
  setTabbarLabelsVisible
} from '../../../shared/config'
import { useSnackbar } from '../../../shared/hooks'
import type { Props } from '../../types.ts'
import {
  getThemePreference,
  setThemePreference,
  THEME_LABELS,
  type ThemePreference
} from '../shared/theme'

const AppearanceSettings: FC<Props> = ({ id }) => {
  const [theme, setTheme] = useState<ThemePreference>(getThemePreference)
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

  const handleLabelsChange = (checked: boolean) => {
    setShowLabels(checked)
    setTabbarLabelsVisible(checked)
  }

  const handleIconChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const next = event.currentTarget.value
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
            bottom='Доступно в Android-приложении. Иногда ярлык обновляется с задержкой.'
          >
            <NativeSelect
              value={iconId}
              onChange={(e) => void handleIconChange(e)}
            >
              {iconOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </NativeSelect>
          </FormItem>
        </Group>
      )}
      {snackbar}
    </Panel>
  )
}

export default AppearanceSettings
