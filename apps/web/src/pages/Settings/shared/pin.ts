import { b64 } from '@diary-spo/crypto'

export const APP_PIN_HASH_KEY = 'appPinHash'
export const APP_PIN_LENGTH = 4
export const PIN_UNLOCK_EVENT = 'diary-pin-unlock'
export const PIN_LOCK_EVENT = 'diary-pin-lock'

let unlockedThisSession = false

export const isPinEnabled = (): boolean => {
  try {
    return Boolean(localStorage.getItem(APP_PIN_HASH_KEY))
  } catch {
    return false
  }
}

export const isPinUnlocked = (): boolean =>
  !isPinEnabled() || unlockedThisSession

export const unlockPinSession = (): void => {
  unlockedThisSession = true
  try {
    window.dispatchEvent(new Event(PIN_UNLOCK_EVENT))
  } catch {
    // Слушателя нет - экран пинкода уже сам разберётся
  }
}

export const lockPinSession = (): void => {
  if (!isPinEnabled()) return
  unlockedThisSession = false
  try {
    window.dispatchEvent(new Event(PIN_LOCK_EVENT))
  } catch {
    // Слушателя нет - экран пинкода уже сам разберётся
  }
}

const hashPin = async (pin: string): Promise<string> => b64(pin)

export const verifyPin = async (pin: string): Promise<boolean> => {
  try {
    const stored = localStorage.getItem(APP_PIN_HASH_KEY)
    if (!stored) return true
    return (await hashPin(pin)) === stored
  } catch {
    return false
  }
}

export const setPin = async (pin: string): Promise<void> => {
  localStorage.setItem(APP_PIN_HASH_KEY, await hashPin(pin))
  unlockPinSession()
}

export const clearPin = (): void => {
  try {
    localStorage.removeItem(APP_PIN_HASH_KEY)
  } catch {
    // localStorage может быть недоступен - пинкод просто не сбросится
  }
  unlockedThisSession = true
  try {
    window.dispatchEvent(new Event(PIN_UNLOCK_EVENT))
  } catch {
    // Слушателя нет - экран пинкода уже сам разберётся
  }
}

export const isValidPinFormat = (pin: string): boolean =>
  new RegExp(`^\\d{${APP_PIN_LENGTH}}$`).test(pin)
