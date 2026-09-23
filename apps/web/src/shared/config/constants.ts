export const SECOND = 1000
export const THIRD_SEC = 30 * SECOND
/** Modal's ids */
export const MODAL_PAGE_LESSON = 'lesson'
export const MODAL_PAGE_MARK = 'mark'

export type ThemePreference = 'auto' | 'light' | 'dark'

export const THEME_STORAGE_KEY = 'themePreference'
export const THEME_CHANGE_EVENT = 'diary-theme-change'

export const getThemePreference = (): ThemePreference => {
  const preference = localStorage.getItem(THEME_STORAGE_KEY)

  return preference === 'light' || preference === 'dark' ? preference : 'auto'
}
