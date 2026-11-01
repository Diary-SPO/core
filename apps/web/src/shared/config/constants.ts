export const SECOND = 1000
export const THIRD_SEC = 30 * SECOND
/** Modal's ids */
export const MODAL_PAGE_LESSON = 'lesson'
export const MODAL_PAGE_MARK = 'mark'
export const MODAL_PAGE_REGION = 'diary-region'
export const MODAL_PAGE_RECOMMEND_APP = 'recommend-app'
export const MODAL_PAGE_LOGIN_DIAGNOSTICS = 'login-diagnostics'
export const MODAL_PAGE_STORAGE_INSPECT = 'storage-inspect'

// Временно включено для проверки модалки при каждом новом запуске приложения.
export const RECOMMENDATION_PROMPT_TEST_MODE = false

export type ThemePreference = 'auto' | 'light' | 'dark'

export const THEME_STORAGE_KEY = 'themePreference'
export const THEME_CHANGE_EVENT = 'diary-theme-change'

export const getThemePreference = (): ThemePreference => {
  const preference = localStorage.getItem(THEME_STORAGE_KEY)

  return preference === 'light' || preference === 'dark' ? preference : 'auto'
}

export const TABBAR_LABELS_STORAGE_KEY = 'tabbarLabelsVisible'
export const TABBAR_LABELS_CHANGE_EVENT = 'diary-tabbar-labels-change'

export const getTabbarLabelsVisible = (): boolean => {
  try {
    const value = localStorage.getItem(TABBAR_LABELS_STORAGE_KEY)
    if (value === null) return true
    return value !== '0'
  } catch {
    return true
  }
}

export const setTabbarLabelsVisible = (visible: boolean): void => {
  try {
    localStorage.setItem(TABBAR_LABELS_STORAGE_KEY, visible ? '1' : '0')
  } catch {
    // localStorage может быть недоступен - настройка просто не сохранится
  }
  window.dispatchEvent(
    new CustomEvent<boolean>(TABBAR_LABELS_CHANGE_EVENT, { detail: visible })
  )
}
