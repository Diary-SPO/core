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

const resolveIsDark = (preference: ThemePreference): boolean => {
  if (preference === 'dark') return true
  if (preference === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const setThemePreference = (preference: ThemePreference): void => {
  localStorage.setItem(THEME_STORAGE_KEY, preference)
  // Держим html-фон в sync с color_background, иначе по бокам колонок
  // остаётся «полоса» от раннего FOUC-стиля.
  document.documentElement.style.background = resolveIsDark(preference)
    ? '#0a0a0a'
    : '#ffffff'
  window.dispatchEvent(
    new CustomEvent<ThemePreference>(THEME_CHANGE_EVENT, {
      detail: preference
    })
  )
}

export type { ThemePreference }
export { getThemePreference }
