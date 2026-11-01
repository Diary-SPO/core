import {
  Icon28ChevronRightOutline,
  Icon28HelpOutline,
  Icon28InfoCircleOutline,
  Icon28PaletteOutline,
  Icon28SettingsOutline
} from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Group, Header, Panel, SimpleCell } from '@vkontakte/vkui'
import { type FC, useEffect, useState } from 'react'

import {
  PAGE_SETTINGS_ABOUT,
  PAGE_SETTINGS_APP,
  PAGE_SETTINGS_APPEARANCE,
  PAGE_SETTINGS_HELP
} from '../../app/routes'
import { PanelHeaderWithBack } from '../../shared'
import { THEME_CHANGE_EVENT } from '../../shared/config'
import type { Props } from '../types.ts'
import Footer from './Footer'
import GradeNotifications from './GradeNotifications'
import LogoutButton from './LogoutButton'
import ProfileHeader from './ProfileHeader'
import {
  getThemePreference,
  THEME_LABELS,
  type ThemePreference
} from './shared/theme'

const Settings: FC<Props> = ({ id }) => {
  const routeNavigator = useRouteNavigator()
  const [theme, setTheme] = useState<ThemePreference>(getThemePreference)

  useEffect(() => {
    const onThemeChange = (event: Event) => {
      const preference = (event as CustomEvent<ThemePreference>).detail
      if (preference) setTheme(preference)
      else setTheme(getThemePreference())
    }
    window.addEventListener(THEME_CHANGE_EVENT, onThemeChange)
    return () => window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange)
  }, [])

  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title='Профиль' showBack={false} />
      <ProfileHeader />

      <Group header={<Header size='s'>Быстрые действия</Header>}>
        <GradeNotifications compact />
        <SimpleCell
          before={<Icon28PaletteOutline />}
          subtitle={THEME_LABELS[theme]}
          after={<Icon28ChevronRightOutline />}
          onClick={() => void routeNavigator.push(PAGE_SETTINGS_APPEARANCE)}
        >
          Тема
        </SimpleCell>
      </Group>

      <Group>
        <SimpleCell
          before={<Icon28SettingsOutline />}
          subtitle='Оформление, уведомления, аккаунт'
          after={<Icon28ChevronRightOutline />}
          onClick={() => void routeNavigator.push(PAGE_SETTINGS_APP)}
          multiline
        >
          Настройки
        </SimpleCell>
        <SimpleCell
          before={<Icon28HelpOutline />}
          subtitle='FAQ и контакты'
          after={<Icon28ChevronRightOutline />}
          onClick={() => void routeNavigator.push(PAGE_SETTINGS_HELP)}
        >
          Помощь
        </SimpleCell>
        <SimpleCell
          before={<Icon28InfoCircleOutline />}
          subtitle='Версия и документы'
          after={<Icon28ChevronRightOutline />}
          onClick={() => void routeNavigator.push(PAGE_SETTINGS_ABOUT)}
        >
          О приложении
        </SimpleCell>
      </Group>

      <LogoutButton />
      <Footer />
    </Panel>
  )
}

export { default as AboutSettings } from './About'
export { default as AccountSettings } from './Account'
export { default as AppearanceSettings } from './Appearance'
export { default as AppSettings } from './AppSettings'
export { default as DeveloperSettings } from './Developer'
export { default as HelpSettings } from './Help'
export { default as NotificationsSettings } from './Notifications'
export default Settings
