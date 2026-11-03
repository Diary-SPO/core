export const SECOND = 1000
export const THIRD_SEC = 30 * SECOND
/** Modal's ids */
export const MODAL_PAGE_LESSON = 'lesson'
export const MODAL_PAGE_MARK = 'mark'
export const MODAL_PAGE_REGION = 'diary-region'
export const MODAL_PAGE_RECOMMEND_APP = 'recommend-app'
export const MODAL_PAGE_LOGIN_DIAGNOSTICS = 'login-diagnostics'
export const MODAL_PAGE_STORAGE_INSPECT = 'storage-inspect'
export const MODAL_PAGE_APP_UPDATE = 'app-update'
export const MODAL_PAGE_WEEK_PICKER = 'week-picker'

export const RUSTORE_APP_URL =
  'https://www.rustore.ru/catalog/app/io.github.diaryspo'

// Временно включено для проверки модалки при каждом новом запуске приложения.
export const RECOMMENDATION_PROMPT_TEST_MODE = false

export const TABBAR_LABELS_STORAGE_KEY = 'tabbarLabelsVisible'
export const TABBAR_LABELS_CHANGE_EVENT = 'diary-tabbar-labels-change'

export const ACCENT_ON_TABBAR_KEY = 'accentOnTabbar'
export const ACCENT_ON_TABBAR_EVENT = 'diary-accent-on-tabbar-change'
export const ACCENT_ON_HOME_CONTROLS_KEY = 'accentOnHomeControls'
export const ACCENT_ON_HOME_CONTROLS_EVENT = 'diary-accent-on-home-controls-change'

const readFlag = (key: string, fallback = true): boolean => {
  try {
    const value = localStorage.getItem(key)
    if (value === null) return fallback
    return value !== '0'
  } catch {
    return fallback
  }
}

const writeFlag = (key: string, event: string, value: boolean): void => {
  try {
    localStorage.setItem(key, value ? '1' : '0')
  } catch {
    // localStorage может быть недоступен
  }
  window.dispatchEvent(new CustomEvent<boolean>(event, { detail: value }))
}

export const getTabbarLabelsVisible = (): boolean =>
  readFlag(TABBAR_LABELS_STORAGE_KEY, true)

export const setTabbarLabelsVisible = (visible: boolean): void => {
  writeFlag(TABBAR_LABELS_STORAGE_KEY, TABBAR_LABELS_CHANGE_EVENT, visible)
}

export const getAccentOnTabbar = (): boolean =>
  readFlag(ACCENT_ON_TABBAR_KEY, true)

export const setAccentOnTabbar = (enabled: boolean): void => {
  writeFlag(ACCENT_ON_TABBAR_KEY, ACCENT_ON_TABBAR_EVENT, enabled)
  document.documentElement.classList.toggle('diary-accent-tabbar', enabled)
}

export const getAccentOnHomeControls = (): boolean =>
  readFlag(ACCENT_ON_HOME_CONTROLS_KEY, true)

export const setAccentOnHomeControls = (enabled: boolean): void => {
  writeFlag(ACCENT_ON_HOME_CONTROLS_KEY, ACCENT_ON_HOME_CONTROLS_EVENT, enabled)
  document.documentElement.classList.toggle('diary-accent-home', enabled)
}
