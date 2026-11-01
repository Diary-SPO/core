export const DEVELOPER_MODE_KEY = 'developerModeUnlocked'
export const DEVELOPER_MODE_EVENT = 'developer-mode-unlocked'

export const isDeveloperModeUnlocked = (): boolean => {
  try {
    return localStorage.getItem(DEVELOPER_MODE_KEY) === '1'
  } catch {
    return false
  }
}

export const unlockDeveloperMode = (): void => {
  try {
    localStorage.setItem(DEVELOPER_MODE_KEY, '1')
  } catch {
    // localStorage может быть недоступен
  }
  try {
    window.dispatchEvent(new Event(DEVELOPER_MODE_EVENT))
  } catch {
    // window может быть недоступен
  }
}

export const DEVELOPER_UNLOCK_TAPS = 7
