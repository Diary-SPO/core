import { BackgroundRunner } from '@capacitor/background-runner'
import { Capacitor } from '@capacitor/core'
import type {
  BackgroundGradeInterval,
  BackgroundGradeNotifications,
  BackgroundGradeSettings
} from '../../web/src/shared/api/runtime/types.ts'

const RUNNER_LABEL = 'io.github.diaryspo.grade-check'
const SETTINGS_STORAGE_KEY = 'backgroundGradeSettings'
const DEFAULT_SETTINGS: BackgroundGradeSettings = {
  enabled: false,
  intervalMinutes: 30
}
const validIntervals: BackgroundGradeInterval[] = [15, 30, 60, 120]

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
  studentId: number
) => {
  if (!Capacitor.isNativePlatform()) return

  await dispatch('gradeSessionSync', {
    baseUrl: import.meta.env.VITE_DIARY_URL || 'https://poo.tomedu.ru',
    cookie,
    settings: localStorage.getItem(SETTINGS_STORAGE_KEY),
    studentId
  })
}

export const clearBackgroundGradeSession = async () => {
  if (!Capacitor.isNativePlatform()) return
  await dispatch('gradeSessionClear')
}

export const backgroundGradeNotifications: BackgroundGradeNotifications = {
  supported: Capacitor.isNativePlatform(),
  getSettings: () => parseSettings(localStorage.getItem(SETTINGS_STORAGE_KEY)),
  async setSettings(settings) {
    const previousSettings = parseSettings(
      localStorage.getItem(SETTINGS_STORAGE_KEY)
    )
    let nextSettings = settings

    if (settings.enabled && !previousSettings.enabled) {
      const permissions = await BackgroundRunner.requestPermissions({
        apis: ['notifications']
      })

      if (permissions.notifications !== 'granted') {
        nextSettings = { ...settings, enabled: false }
      }
    }

    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(nextSettings))

    void (async () => {
      await dispatch('gradeSettingsUpdate', {
        settings: JSON.stringify(nextSettings)
      })

      const cookie = localStorage.getItem('directDiaryCookies') ?? ''
      const studentId = Number(localStorage.getItem('id'))
      if (cookie && Number.isInteger(studentId) && studentId > 0) {
        await syncBackgroundGradeSession(cookie, studentId)
      }

      if (nextSettings.enabled) await dispatch('gradeCheck')
    })().catch((error) =>
      console.error('Unable to update background grade settings', error)
    )

    return nextSettings
  }
}
