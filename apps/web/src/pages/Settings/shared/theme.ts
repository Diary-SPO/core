import {
  getThemePreference,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  type ThemePreference
} from '../../../shared/config'

export const THEME_LABELS: Record<ThemePreference, string> = {
  auto: 'Автоматически',
  light: 'Светлая',
  dark: 'Тёмная'
}

export const setThemePreference = (preference: ThemePreference): void => {
  localStorage.setItem(THEME_STORAGE_KEY, preference)
  window.dispatchEvent(
    new CustomEvent<ThemePreference>(THEME_CHANGE_EVENT, {
      detail: preference
    })
  )
}

export type { ThemePreference }
export { getThemePreference }
