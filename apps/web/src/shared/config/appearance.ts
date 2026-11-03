export type ThemePreference = 'auto' | 'light' | 'dark' | 'oled'

export type AccentId =
  | 'blue'
  | 'sky'
  | 'indigo'
  | 'violet'
  | 'pink'
  | 'red'
  | 'orange'
  | 'green'
  | 'teal'

export interface AccentOption {
  id: AccentId
  label: string
  base: string
  hover: string
  active: string
}

export const THEME_STORAGE_KEY = 'themePreference'
export const THEME_CHANGE_EVENT = 'diary-theme-change'

export const ACCENT_STORAGE_KEY = 'accentPreference'
export const ACCENT_CHANGE_EVENT = 'diary-accent-change'

export const ACCENT_OPTIONS: AccentOption[] = [
  {
    id: 'blue',
    label: 'Синий',
    base: '#2688eb',
    hover: '#2483e4',
    active: '#237edd'
  },
  {
    id: 'sky',
    label: 'Голубой',
    base: '#4ca0f5',
    hover: '#4598eb',
    active: '#3f90e0'
  },
  {
    id: 'indigo',
    label: 'Индиго',
    base: '#5b6cff',
    hover: '#5564f2',
    active: '#4f5de5'
  },
  {
    id: 'violet',
    label: 'Фиолетовый',
    base: '#792ec0',
    hover: '#722cb6',
    active: '#6b29ab'
  },
  {
    id: 'pink',
    label: 'Розовый',
    base: '#e73d8c',
    hover: '#db3a85',
    active: '#cf367e'
  },
  {
    id: 'red',
    label: 'Красный',
    base: '#e64646',
    hover: '#db4343',
    active: '#cf3f3f'
  },
  {
    id: 'orange',
    label: 'Оранжевый',
    base: '#f08722',
    hover: '#e48020',
    active: '#d8791e'
  },
  {
    id: 'green',
    label: 'Зелёный',
    base: '#4bb34b',
    hover: '#47aa47',
    active: '#43a043'
  },
  {
    id: 'teal',
    label: 'Бирюзовый',
    base: '#18a3a8',
    hover: '#169b9f',
    active: '#149297'
  }
]

export const DEFAULT_ACCENT: AccentId = 'blue'

export const getThemePreference = (): ThemePreference => {
  const preference = localStorage.getItem(THEME_STORAGE_KEY)
  if (
    preference === 'light' ||
    preference === 'dark' ||
    preference === 'oled'
  ) {
    return preference
  }
  return 'auto'
}

export const getAccentPreference = (): AccentId => {
  const value = localStorage.getItem(ACCENT_STORAGE_KEY)
  return ACCENT_OPTIONS.some((option) => option.id === value)
    ? (value as AccentId)
    : DEFAULT_ACCENT
}

export const resolveIsDark = (preference: ThemePreference): boolean => {
  if (preference === 'dark' || preference === 'oled') return true
  if (preference === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const resolveHtmlBackground = (preference: ThemePreference): string => {
  if (preference === 'oled') return '#000000'
  if (resolveIsDark(preference)) return '#0a0a0a'
  return '#ffffff'
}

export const toColorScheme = (
  preference: ThemePreference,
  systemAppearance?: 'light' | 'dark'
): 'light' | 'dark' => {
  if (preference === 'light') return 'light'
  if (preference === 'dark' || preference === 'oled') return 'dark'
  return systemAppearance === 'light' ? 'light' : 'dark'
}

export const getAccentOption = (accent: AccentId): AccentOption =>
  ACCENT_OPTIONS.find((option) => option.id === accent) ?? ACCENT_OPTIONS[0]

export const syncAppearanceToDocument = (
  preference: ThemePreference,
  accent: AccentId
): void => {
  const root = document.documentElement
  root.classList.toggle('diary-oled', preference === 'oled')
  root.style.background = resolveHtmlBackground(preference)

  const option = getAccentOption(accent)
  root.style.setProperty('--diary-accent', option.base)
  root.style.setProperty('--diary-accent-hover', option.hover)
  root.style.setProperty('--diary-accent-active', option.active)
}
