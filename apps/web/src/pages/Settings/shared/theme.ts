import {
  ACCENT_CHANGE_EVENT,
  ACCENT_STORAGE_KEY,
  type AccentId,
  getAccentPreference,
  getOledPreference,
  getThemePreference,
  OLED_CHANGE_EVENT,
  OLED_STORAGE_KEY,
  resolveHtmlBackground,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  type ThemePreference
} from '../../../shared/config'

export const THEME_LABELS: Record<ThemePreference, string> = {
  auto: 'Автоматически',
  light: 'Светлая',
  dark: 'Тёмная'
}

const syncThemeColorMeta = (preference: ThemePreference): void => {
  const background = resolveHtmlBackground(preference)
  document.documentElement.style.background = background
  const themeColor = document.querySelector('meta[name="theme-color"]')
  if (themeColor) {
    themeColor.setAttribute('content', background)
  }
}

export const setThemePreference = (preference: ThemePreference): void => {
  localStorage.setItem(THEME_STORAGE_KEY, preference)
  syncThemeColorMeta(preference)
  window.dispatchEvent(
    new CustomEvent<ThemePreference>(THEME_CHANGE_EVENT, {
      detail: preference
    })
  )
}

export const setOledPreference = (enabled: boolean): void => {
  localStorage.setItem(OLED_STORAGE_KEY, enabled ? '1' : '0')
  syncThemeColorMeta(getThemePreference())
  window.dispatchEvent(
    new CustomEvent<boolean>(OLED_CHANGE_EVENT, { detail: enabled })
  )
}

export const setAccentPreference = (accent: AccentId): void => {
  localStorage.setItem(ACCENT_STORAGE_KEY, accent)
  window.dispatchEvent(
    new CustomEvent<AccentId>(ACCENT_CHANGE_EVENT, { detail: accent })
  )
}

export type { AccentId, ThemePreference }
export { getAccentPreference, getOledPreference, getThemePreference }
