import { Icon28PaletteOutline } from '@vkontakte/icons'
import { FormItem, Group, Header, NativeSelect, Panel } from '@vkontakte/vkui'
import { type ChangeEvent, type FC, useState } from 'react'

import { PanelHeaderWithBack } from '../../shared'
import {
  getThemePreference,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  type ThemePreference
} from '../../shared/config'
import type { Props } from '../types.ts'

import Actions from './Actions'
import Contacts from './Contacts.tsx'
import FAQ from './FAQ'
import Footer from './Footer'
import GradeNotifications from './GradeNotifications.tsx'
import Legal from './Legal.tsx'

const ThemeSettings: FC = () => {
  const [theme, setTheme] = useState<ThemePreference>(getThemePreference)

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const preference = event.currentTarget.value as ThemePreference
    setTheme(preference)
    localStorage.setItem(THEME_STORAGE_KEY, preference)
    window.dispatchEvent(
      new CustomEvent<ThemePreference>(THEME_CHANGE_EVENT, {
        detail: preference
      })
    )
  }

  return (
    <Group header={<Header size='s'>Оформление</Header>}>
      <FormItem top='Тема приложения'>
        <NativeSelect
          before={<Icon28PaletteOutline />}
          value={theme}
          onChange={handleThemeChange}
        >
          <option value='auto'>Автоматически</option>
          <option value='light'>Светлая</option>
          <option value='dark'>Тёмная</option>
        </NativeSelect>
      </FormItem>
    </Group>
  )
}

const Settings: FC<Props> = ({ id }) => {
  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title='Настройки' />
      <ThemeSettings />
      <FAQ />
      <GradeNotifications />
      <Actions />
      <Legal />
      <Contacts />
      <Footer />
    </Panel>
  )
}

export default Settings
