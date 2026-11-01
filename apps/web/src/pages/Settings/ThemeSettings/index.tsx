import { Icon28PaletteOutline } from '@vkontakte/icons'
import { FormItem, Group, Header, NativeSelect } from '@vkontakte/vkui'
import { type ChangeEvent, type FC, useState } from 'react'

import {
  getThemePreference,
  setThemePreference,
  THEME_LABELS,
  type ThemePreference
} from '../shared/theme'

const ThemeSettings: FC = () => {
  const [theme, setTheme] = useState<ThemePreference>(getThemePreference)

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const preference = event.currentTarget.value as ThemePreference
    setTheme(preference)
    setThemePreference(preference)
  }

  return (
    <Group header={<Header size='s'>Оформление</Header>}>
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
  )
}

export default ThemeSettings
