export const DIARY_REQUEST_FAILED_EVENT = 'diary-request-failed'

export const emitRequestFailed = (status: number): void => {
  try {
    if (typeof window === 'undefined') return
    window.dispatchEvent(
      new CustomEvent(DIARY_REQUEST_FAILED_EVENT, { detail: { status } })
    )
  } catch {
    // Слушателя нет - экраны уже показали свою ошибку
  }
}

// Сносим только авторизацию, регион и настройки живут дальше.
const AUTH_KEYS = ['id', 'token', 'data', 'directDiaryCookies']

export const clearAuthData = (): void => {
  try {
    for (const key of AUTH_KEYS) localStorage.removeItem(key)
  } catch {
    // localStorage может быть недоступен
  }
}

export const hasAuthData = (): boolean => {
  try {
    return Boolean(localStorage.getItem('token') || localStorage.getItem('id'))
  } catch {
    return false
  }
}
