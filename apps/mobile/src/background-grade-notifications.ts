import { BackgroundRunner } from '@capacitor/background-runner'
import { Capacitor } from '@capacitor/core'
import {
  BACKGROUND_GRADE_INTERVALS,
  type BackgroundGradeDebugRetestResult,
  type BackgroundGradeInterval,
  type BackgroundGradeNotifications,
  type BackgroundGradeSettings
} from '../../web/src/shared/api/runtime/types.ts'
import { appendAppLog } from '../../web/src/shared/utils/appLog'

const RUNNER_LABEL = 'io.github.diaryspo.grade-check'
const SETTINGS_STORAGE_KEY = 'backgroundGradeSettings'
const DEFAULT_SETTINGS: BackgroundGradeSettings = {
  enabled: false,
  intervalMinutes: 30
}
const validIntervals: BackgroundGradeInterval[] = [
  ...BACKGROUND_GRADE_INTERVALS
]

const parseSettings = (value: string | null): BackgroundGradeSettings => {
  if (!value) return DEFAULT_SETTINGS

  try {
    const parsed = JSON.parse(value) as Partial<BackgroundGradeSettings>
    const intervalMinutes = validIntervals.includes(
      parsed.intervalMinutes as BackgroundGradeInterval
    )
      ? (parsed.intervalMinutes as BackgroundGradeInterval)
      : DEFAULT_SETTINGS.intervalMinutes

    return {
      enabled: parsed.enabled === true,
      intervalMinutes
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

const dispatch = (event: string, details: Record<string, unknown> = {}) =>
  BackgroundRunner.dispatchEvent({
    details,
    event,
    label: RUNNER_LABEL
  })

export const syncBackgroundGradeSession = async (
  cookie: string,
  studentId: number,
  baseUrl: string
) => {
  if (!Capacitor.isNativePlatform()) return

  await dispatch('gradeSessionSync', {
    baseUrl,
    cookie,
    settings: localStorage.getItem(SETTINGS_STORAGE_KEY),
    studentId
  })
}

export const clearBackgroundGradeSession = async () => {
  if (!Capacitor.isNativePlatform()) return
  await dispatch('gradeSessionClear')
}

const syncSessionFromLocalStorage = async () => {
  const cookie = localStorage.getItem('directDiaryCookies') ?? ''
  const studentId = Number(localStorage.getItem('id'))
  const baseUrl =
    localStorage.getItem('directDiaryBaseUrl') ||
    import.meta.env.VITE_DIARY_URL ||
    'https://poo.tomedu.ru'
  if (cookie && Number.isInteger(studentId) && studentId > 0) {
    await syncBackgroundGradeSession(cookie, studentId, baseUrl)
    return
  }
  appendAppLog(
    'notifications',
    'session sync skipped',
    `cookie=${Boolean(cookie)} studentId=${studentId}`
  )
}

export const backgroundGradeNotifications: BackgroundGradeNotifications = {
  supported: Capacitor.isNativePlatform(),
  getSettings: () => parseSettings(localStorage.getItem(SETTINGS_STORAGE_KEY)),
  async setSettings(settings) {
    const previousSettings = parseSettings(
      localStorage.getItem(SETTINGS_STORAGE_KEY)
    )
    const nextSettings = { ...settings }

    if (settings.enabled && !previousSettings.enabled) {
      let permissions: { notifications?: string }
      try {
        permissions = await BackgroundRunner.checkPermissions()
        if (permissions.notifications !== 'granted') {
          permissions = await BackgroundRunner.requestPermissions({
            apis: ['notifications']
          })
        }
      } catch (error) {
        appendAppLog(
          'notifications',
          'requestPermissions failed',
          error instanceof Error ? error.message : String(error)
        )
        throw new Error('Не удалось запросить разрешение на уведомления')
      }

      appendAppLog(
        'notifications',
        `permission=${permissions.notifications ?? 'unknown'}`,
        JSON.stringify(permissions)
      )

      if (permissions.notifications !== 'granted') {
        throw new Error(
          'Нет разрешения на уведомления. Разрешите их в настройках системы.'
        )
      }
    }

    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(nextSettings))
    appendAppLog(
      'notifications',
      nextSettings.enabled ? 'enabled' : 'disabled',
      `interval=${nextSettings.intervalMinutes}`
    )

    try {
      await dispatch('gradeSettingsUpdate', {
        settings: JSON.stringify(nextSettings)
      })
      await syncSessionFromLocalStorage()
      if (nextSettings.enabled) await dispatch('gradeCheck')
    } catch (error) {
      appendAppLog(
        'notifications',
        'runner sync failed',
        error instanceof Error ? error.message : String(error)
      )
    }

    return nextSettings
  },
  async clearSession() {
    appendAppLog('notifications', 'clearSession')
    await clearBackgroundGradeSession()
  },
  async debugRetestNotification(): Promise<BackgroundGradeDebugRetestResult> {
    if (!Capacitor.isNativePlatform()) {
      return { forgotten: null, reason: 'empty' }
    }
    appendAppLog('notifications', 'debugRetest start')
    await syncSessionFromLocalStorage()
    const raw = await dispatch('gradeDebugRetestNotification')
    appendAppLog(
      'notifications',
      'debugRetest raw',
      typeof raw === 'string' ? raw : JSON.stringify(raw)
    )

    const resolved = (raw ?? {
      forgotten: null,
      reason: 'empty'
    }) as BackgroundGradeDebugRetestResult

    appendAppLog(
      'notifications',
      'debugRetest done',
      resolved.forgotten
        ? `${resolved.forgotten.subjectName} ${resolved.forgotten.mark}`
        : resolved.reason || 'empty'
    )
    return resolved
  }
}
