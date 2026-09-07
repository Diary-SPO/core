import {
  createGradeSnapshot,
  diffGradeSnapshots,
  formatGradeNotification,
  type GradeSnapshot
} from '@diary-spo/diary-client'
import type { PerformanceCurrent } from '@diary-spo/shared'

import { shouldRunGradeCheck } from './grade-check-schedule.ts'
import {
  getRunnerStoredValue,
  type RunnerKeyValueStore
} from './runner-storage.ts'

interface RunnerSettings {
  enabled: boolean
  intervalMinutes: number
}

interface RunnerEventDetails {
  baseUrl?: string
  cookie?: string
  settings?: string | null
  studentId?: number
}

interface RunnerGlobal {
  addEventListener(
    event: string,
    callback: (
      resolve: (value?: unknown) => void,
      reject: (error?: unknown) => void,
      details: RunnerEventDetails
    ) => void
  ): void
}

declare const CapacitorKV: RunnerKeyValueStore & {
  remove(key: string): void
  set(key: string, value: string): void
}

declare const CapacitorNotifications: {
  schedule(
    notifications: Array<{
      autoCancel?: boolean
      body: string
      id: number
      scheduleAt: Date
      title: string
    }>
  ): void
}

const runner = globalThis as unknown as RunnerGlobal

const STORAGE = {
  baseUrl: 'gradeBaseUrl',
  cookie: 'gradeCookie',
  lastCheck: 'gradeLastCheck',
  notificationId: 'gradeNotificationId',
  settings: 'gradeSettings',
  snapshot: 'gradeSnapshot',
  studentId: 'gradeStudentId'
} as const

const DEFAULT_SETTINGS: RunnerSettings = {
  enabled: false,
  intervalMinutes: 30
}
const stored = (key: string) => getRunnerStoredValue(CapacitorKV, key)

const parseSettings = (): RunnerSettings => {
  const value = stored(STORAGE.settings)
  if (!value) return DEFAULT_SETTINGS

  try {
    const parsed = JSON.parse(value) as Partial<RunnerSettings>
    return {
      enabled: parsed.enabled === true,
      intervalMinutes: [15, 30, 60, 120].includes(
        Number(parsed.intervalMinutes)
      )
        ? Number(parsed.intervalMinutes)
        : DEFAULT_SETTINGS.intervalMinutes
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

const shouldCheck = (now: Date, settings: RunnerSettings) => {
  const lastCheck = Number(stored(STORAGE.lastCheck) ?? 0)
  return shouldRunGradeCheck(now, lastCheck, settings.intervalMinutes)
}

const nextNotificationId = () => {
  const previous = Number(stored(STORAGE.notificationId) ?? 0)
  const next = previous >= 2_147_483_000 ? 1 : previous + 1
  CapacitorKV.set(STORAGE.notificationId, String(next))
  return next
}

const runGradeCheck = async () => {
  const settings = parseSettings()
  const now = new Date()
  if (!settings.enabled || !shouldCheck(now, settings)) return

  const baseUrl = stored(STORAGE.baseUrl)
  const cookie = stored(STORAGE.cookie)
  const studentId = Number(stored(STORAGE.studentId))
  if (!baseUrl || !cookie || !Number.isInteger(studentId) || studentId <= 0) {
    return
  }

  const response = await fetch(
    `${baseUrl.replace(/\/$/, '')}/services/reports/current/performance/${studentId}`,
    {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Cookie: cookie
      }
    }
  )

  if (!response.ok) {
    if (response.status === 401) CapacitorKV.remove(STORAGE.cookie)
    throw new Error(`Grade check failed with status ${response.status}`)
  }

  const current = createGradeSnapshot(
    (await response.json()) as PerformanceCurrent
  )
  const previousValue = stored(STORAGE.snapshot)

  if (previousValue) {
    const previous = JSON.parse(previousValue) as GradeSnapshot
    const changes = diffGradeSnapshots(previous, current)
    const notifications = changes.map((change) => {
      const notification = formatGradeNotification(change)
      return {
        ...notification,
        autoCancel: true,
        id: nextNotificationId(),
        scheduleAt: new Date()
      }
    })

    if (notifications.length) {
      CapacitorNotifications.schedule(notifications)
    }
  }

  CapacitorKV.set(STORAGE.snapshot, JSON.stringify(current))
  CapacitorKV.set(STORAGE.lastCheck, String(now.getTime()))
}

runner.addEventListener('gradeCheck', (resolve, reject) => {
  runGradeCheck().then(resolve).catch(reject)
})

runner.addEventListener('gradeSessionSync', (resolve, reject, details) => {
  try {
    const previousStudentId = stored(STORAGE.studentId)
    if (
      details.studentId &&
      previousStudentId &&
      previousStudentId !== String(details.studentId)
    ) {
      CapacitorKV.remove(STORAGE.lastCheck)
      CapacitorKV.remove(STORAGE.snapshot)
    }
    if (details.baseUrl) CapacitorKV.set(STORAGE.baseUrl, details.baseUrl)
    if (details.cookie) CapacitorKV.set(STORAGE.cookie, details.cookie)
    if (details.studentId) {
      CapacitorKV.set(STORAGE.studentId, String(details.studentId))
    }
    if (details.settings) {
      CapacitorKV.set(STORAGE.settings, details.settings)
    }
    resolve()
  } catch (error) {
    reject(error)
  }
})

runner.addEventListener('gradeSettingsUpdate', (resolve, reject, details) => {
  try {
    if (details.settings) {
      CapacitorKV.set(STORAGE.settings, details.settings)
      const settings = JSON.parse(details.settings) as RunnerSettings
      if (!settings.enabled) {
        CapacitorKV.remove(STORAGE.lastCheck)
        CapacitorKV.remove(STORAGE.snapshot)
      }
    }
    resolve()
  } catch (error) {
    reject(error)
  }
})

runner.addEventListener('gradeSessionClear', (resolve, reject) => {
  try {
    for (const key of Object.values(STORAGE)) CapacitorKV.remove(key)
    resolve()
  } catch (error) {
    reject(error)
  }
})
