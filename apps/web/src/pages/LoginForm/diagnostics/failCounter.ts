const KEY = 'loginFailCount'

export const readLoginFailCount = (): number => {
  try {
    return Number(localStorage.getItem(KEY)) || 0
  } catch {
    return 0
  }
}

export const resetLoginFailCount = (): void => {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // localStorage может быть недоступен - счётчик просто не сбросится
  }
}

export const bumpLoginFailCount = (): number => {
  const next = readLoginFailCount() + 1
  try {
    localStorage.setItem(KEY, String(next))
  } catch {
    // localStorage может быть недоступен - счётчик просто не сохранится
  }
  return next
}
