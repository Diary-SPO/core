export interface GradeNotificationOpen {
  day: string
  subjectName: string
}

export const GRADE_NOTIFICATION_OPEN_EVENT = 'diary-grade-notification-open'
export const GRADE_NOTIFICATION_OPEN_KEY = 'pendingGradeNotificationOpen'

export const setGradeNotificationOpen = (
  payload: GradeNotificationOpen
): void => {
  try {
    localStorage.setItem(GRADE_NOTIFICATION_OPEN_KEY, JSON.stringify(payload))
  } catch {
    // ignore
  }
  window.dispatchEvent(
    new CustomEvent<GradeNotificationOpen>(GRADE_NOTIFICATION_OPEN_EVENT, {
      detail: payload
    })
  )
}

export const consumeGradeNotificationOpen =
  (): GradeNotificationOpen | null => {
    try {
      const raw = localStorage.getItem(GRADE_NOTIFICATION_OPEN_KEY)
      if (!raw) return null
      localStorage.removeItem(GRADE_NOTIFICATION_OPEN_KEY)
      const parsed = JSON.parse(raw) as Partial<GradeNotificationOpen>
      if (!parsed.day || !parsed.subjectName) return null
      return { day: parsed.day, subjectName: parsed.subjectName }
    } catch {
      return null
    }
  }

export const parseGradeNotificationAction = (
  actionTypeId: string | null | undefined
): GradeNotificationOpen | null => {
  if (!actionTypeId) return null
  try {
    const parsed = JSON.parse(actionTypeId) as Partial<GradeNotificationOpen> & {
      t?: string
    }
    if (parsed.t && parsed.t !== 'grade') return null
    if (!parsed.day || !parsed.subjectName) return null
    return { day: parsed.day, subjectName: parsed.subjectName }
  } catch {
    return null
  }
}
