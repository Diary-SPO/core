export type ThemePreference = 'auto' | 'light' | 'dark'

export type AccentId =
  | 'system'
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

export const OLED_STORAGE_KEY = 'oledPreference'
export const OLED_CHANGE_EVENT = 'diary-oled-change'

export const ACCENT_STORAGE_KEY = 'accentPreference'
export const ACCENT_CHANGE_EVENT = 'diary-accent-change'

const FALLBACK_ACCENT = {
  base: '#2688eb',
  hover: '#2483e4',
  active: '#237edd'
}

export const ACCENT_OPTIONS: AccentOption[] = [
  {
    id: 'system',
    label: 'Системный',
    base: FALLBACK_ACCENT.base,
    hover: FALLBACK_ACCENT.hover,
    active: FALLBACK_ACCENT.active
  },
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

const migrateLegacyOledTheme = (): void => {
  if (localStorage.getItem(THEME_STORAGE_KEY) !== 'oled') return
  localStorage.setItem(THEME_STORAGE_KEY, 'dark')
  localStorage.setItem(OLED_STORAGE_KEY, '1')
}

export const getThemePreference = (): ThemePreference => {
  migrateLegacyOledTheme()
  const preference = localStorage.getItem(THEME_STORAGE_KEY)
  if (preference === 'light' || preference === 'dark') return preference
  return 'auto'
}

export const getOledPreference = (): boolean => {
  migrateLegacyOledTheme()
  return localStorage.getItem(OLED_STORAGE_KEY) === '1'
}

export const getAccentPreference = (): AccentId => {
  const value = localStorage.getItem(ACCENT_STORAGE_KEY)
  return ACCENT_OPTIONS.some((option) => option.id === value)
    ? (value as AccentId)
    : DEFAULT_ACCENT
}

export const resolveIsDark = (preference: ThemePreference): boolean => {
  if (preference === 'dark') return true
  if (preference === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const resolveUsesOled = (
  preference: ThemePreference,
  oled: boolean
): boolean => oled && resolveIsDark(preference)

export const resolveHtmlBackground = (
  preference: ThemePreference,
  oled = getOledPreference()
): string => {
  if (resolveUsesOled(preference, oled)) return '#000000'
  if (resolveIsDark(preference)) return '#0a0a0a'
  return '#ffffff'
}

export const toColorScheme = (
  preference: ThemePreference,
  systemAppearance?: 'light' | 'dark'
): 'light' | 'dark' => {
  if (preference === 'light') return 'light'
  if (preference === 'dark') return 'dark'
  return systemAppearance === 'light' ? 'light' : 'dark'
}

const parseRgb = (color: string): [number, number, number] | null => {
  const match = color.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i)
  if (!match) return null
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

const relativeLuminance = (r: number, g: number, b: number): number => {
  const toLinear = (value: number) => {
    const channel = value / 255
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

const isUsableAccent = (color: string): boolean => {
  const rgb = parseRgb(color)
  if (!rgb) return false
  const luminance = relativeLuminance(...rgb)
  // WebView часто отдаёт белый/почти белый вместо AccentColor.
  return luminance > 0.08 && luminance < 0.72
}

export const readSystemAccentBase = (): string => {
  if (
    typeof CSS !== 'undefined' &&
    CSS.supports &&
    !CSS.supports('color', 'AccentColor')
  ) {
    return FALLBACK_ACCENT.base
  }

  try {
    const probe = document.createElement('span')
    // all:initial — иначе в тёмной теме наследуется белый цвет текста.
    probe.style.cssText =
      'all:initial;position:fixed;left:-9999px;pointer-events:none;color:AccentColor'
    document.documentElement.appendChild(probe)
    const value = getComputedStyle(probe).color
    probe.remove()
    if (!value || !isUsableAccent(value)) return FALLBACK_ACCENT.base
    return value
  } catch {
    return FALLBACK_ACCENT.base
  }
}

export type AccentColors = Pick<AccentOption, 'base' | 'hover' | 'active'>

export const resolveAccentColors = (
  accent: AccentId,
  systemColors?: AccentColors | null
): AccentColors => {
  if (accent === 'system') {
    if (systemColors?.base) return systemColors
    const base = readSystemAccentBase()
    return {
      base,
      hover: `color-mix(in srgb, ${base} 92%, black)`,
      active: `color-mix(in srgb, ${base} 84%, black)`
    }
  }
  return (
    ACCENT_OPTIONS.find((option) => option.id === accent) ?? ACCENT_OPTIONS[1]
  )
}

export const getAccentOption = (accent: AccentId): AccentOption => {
  const option =
    ACCENT_OPTIONS.find((item) => item.id === accent) ?? ACCENT_OPTIONS[1]
  if (accent !== 'system') return option
  const colors = resolveAccentColors('system')
  return { ...option, ...colors }
}

export const syncAppearanceToDocument = (
  preference: ThemePreference,
  accent: AccentId,
  oled = getOledPreference(),
  systemColors?: AccentColors | null
): void => {
  const root = document.documentElement
  const useOled = resolveUsesOled(preference, oled)
  root.classList.toggle('diary-oled', useOled)
  root.style.background = resolveHtmlBackground(preference, oled)

  const colors = resolveAccentColors(accent, systemColors)
  root.style.setProperty('--diary-accent', colors.base)
  root.style.setProperty('--diary-accent-hover', colors.hover)
  root.style.setProperty('--diary-accent-active', colors.active)
}
