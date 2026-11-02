import { App } from '@capacitor/app'
import { Capacitor, CapacitorHttp, registerPlugin } from '@capacitor/core'
import { CapacitorUpdater } from '@capgo/capacitor-updater'
import type {
  AppUpdateChannel,
  AppUpdateInfo,
  AppUpdateKind,
  AppUpdater,
  AppUpdaterDebugPromptOptions,
  AppUpdateStatus
} from '../../web/src/shared/api/runtime/types.ts'
import {
  APP_UPDATE_PROMPT_EVENT,
  APP_UPDATE_STATUS_EVENT,
  type AppUpdatePromptDetail,
  setPendingAppUpdatePrompt
} from '../../web/src/shared/utils/appUpdate.ts'

const OTA_BASE = 'https://diary-spo.github.io/mobile'
const CHANNEL_KEY = 'otaChannel'
const DISMISSED_KEY = 'otaDismissedVersion'
const BADGE_KEY = 'otaBadge'

interface DiaryNetworkPlugin {
  isVpnActive(): Promise<{ active: boolean }>
  getTransport(): Promise<{ transport: 'wifi' | 'cellular' | 'none' | 'other' }>
}

const diaryNetwork = registerPlugin<DiaryNetworkPlugin>('DiaryNetwork')

interface ManifestDto {
  version: string
  minNative: number
  url: string
  checksum: string
  notes?: string
}

const listeners = new Set<(status: AppUpdateStatus) => void>()

let readyNotified = false
let currentVersion = 'builtin'
let nativeVersionCode = 0
let kind: AppUpdateKind = 'none'
let available: AppUpdateInfo | null = null
let downloadedVersion: string | null = null
let progress: number | null = null
let lastError: string | null = null
let checking = false
let downloading = false

const readChannel = (): AppUpdateChannel => {
  const value = localStorage.getItem(CHANNEL_KEY)
  return value === 'beta' ? 'beta' : 'stable'
}

const writeChannel = (channel: AppUpdateChannel) => {
  localStorage.setItem(CHANNEL_KEY, channel)
}

const hasBadge = (): boolean => localStorage.getItem(BADGE_KEY) === '1'

const setBadgeFlag = (value: boolean) => {
  if (value) localStorage.setItem(BADGE_KEY, '1')
  else localStorage.removeItem(BADGE_KEY)
}

const dismissedVersion = (): string | null =>
  localStorage.getItem(DISMISSED_KEY)

const setDismissedVersion = (version: string | null) => {
  if (version) localStorage.setItem(DISMISSED_KEY, version)
  else localStorage.removeItem(DISMISSED_KEY)
}

const compareSemver = (a: string, b: string): number => {
  const pa = a.split('.').map((part) => Number.parseInt(part, 10) || 0)
  const pb = b.split('.').map((part) => Number.parseInt(part, 10) || 0)
  const len = Math.max(pa.length, pb.length)
  for (let i = 0; i < len; i += 1) {
    const da = pa[i] ?? 0
    const db = pb[i] ?? 0
    if (da !== db) return da < db ? -1 : 1
  }
  return 0
}

const isNewer = (remote: string, local: string): boolean =>
  compareSemver(remote, local) > 0

const manifestUrl = (channel: AppUpdateChannel): string =>
  `${OTA_BASE}/${channel}/manifest.json`

const getStatus = (): AppUpdateStatus => ({
  supported: Capacitor.isNativePlatform(),
  channel: readChannel(),
  currentVersion,
  nativeVersionCode,
  kind,
  available,
  downloadedVersion,
  badge: hasBadge(),
  progress,
  lastError
})

const emit = () => {
  const status = getStatus()
  for (const listener of listeners) listener(status)
  window.dispatchEvent(
    new CustomEvent(APP_UPDATE_STATUS_EVENT, { detail: status })
  )
}

const emitPrompt = (detail: AppUpdatePromptDetail) => {
  setPendingAppUpdatePrompt(detail)
  window.dispatchEvent(new CustomEvent(APP_UPDATE_PROMPT_EVENT, { detail }))
}

const refreshBundleInfo = async () => {
  try {
    const current = await CapacitorUpdater.current()
    currentVersion = current?.bundle?.version || currentVersion
  } catch {
    // builtin
  }

  try {
    const info = await App.getInfo()
    nativeVersionCode = Number.parseInt(info.build || '0', 10) || 0
  } catch {
    nativeVersionCode = 0
  }

  try {
    const list = await CapacitorUpdater.list()
    const downloaded = (list.bundles ?? []).find(
      (bundle) =>
        bundle.status === 'pending' ||
        (bundle.version &&
          bundle.version !== currentVersion &&
          bundle.status !== 'error')
    )
    downloadedVersion = downloaded?.version ?? null
    if (downloadedVersion && kind !== 'downloading') {
      kind = 'ready'
    }
  } catch {
    downloadedVersion = null
  }
}

const ensureReady = async () => {
  if (!Capacitor.isNativePlatform() || readyNotified) return
  try {
    await CapacitorUpdater.notifyAppReady()
    readyNotified = true
  } catch (error) {
    console.warn('notifyAppReady failed', error)
  }
}

const fetchManifest = async (
  channel: AppUpdateChannel
): Promise<ManifestDto | null> => {
  // CapacitorHttp — без CORS WebView; не через window.fetch.
  const response = await CapacitorHttp.request({
    method: 'GET',
    url: `${manifestUrl(channel)}?t=${Date.now()}`,
    headers: { Accept: 'application/json' },
    connectTimeout: 8_000,
    readTimeout: 8_000
  })
  if (response.status === 404) return null
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Манифест недоступен (${response.status})`)
  }
  const data = response.data
  if (typeof data === 'string') {
    return JSON.parse(data) as ManifestDto
  }
  return data as ManifestDto
}

const toUpdateInfo = (
  manifest: ManifestDto,
  channel: AppUpdateChannel
): AppUpdateInfo => ({
  version: manifest.version,
  notes: manifest.notes?.trim() || 'Улучшения и исправления',
  minNative: Number(manifest.minNative) || 0,
  channel,
  url: manifest.url,
  checksum: manifest.checksum
})

const isWifi = async (): Promise<boolean> => {
  try {
    const { transport } = await diaryNetwork.getTransport()
    return transport === 'wifi'
  } catch {
    return false
  }
}

const downloadBundle = async (update: AppUpdateInfo): Promise<void> => {
  downloading = true
  kind = 'downloading'
  progress = 0
  lastError = null
  emit()

  const progressSub = await CapacitorUpdater.addListener(
    'download',
    (event) => {
      progress =
        typeof event.percent === 'number'
          ? Math.max(0, Math.min(100, event.percent))
          : progress
      emit()
    }
  )

  try {
    const bundle = await CapacitorUpdater.download({
      version: update.version,
      url: update.url,
      checksum: update.checksum
    })
    downloadedVersion = bundle.version
    kind = 'ready'
    progress = 100
  } finally {
    progressSub.remove()
    downloading = false
    emit()
  }
}

const checkInternal = async (options?: {
  silent?: boolean
  allowPrompt?: boolean
}): Promise<AppUpdateStatus> => {
  if (!Capacitor.isNativePlatform()) return getStatus()
  if (checking) return getStatus()

  checking = true
  lastError = null
  emit()

  try {
    await ensureReady()
    await refreshBundleInfo()

    const channel = readChannel()
    const manifest = await fetchManifest(channel)

    if (!manifest?.version || !manifest.url || !manifest.checksum) {
      available = null
      if (kind !== 'ready' && kind !== 'downloading') kind = 'none'
      emit()
      return getStatus()
    }

    const update = toUpdateInfo(manifest, channel)
    available = update

    if (nativeVersionCode > 0 && nativeVersionCode < update.minNative) {
      kind = 'native'
      if (options?.allowPrompt !== false && !options?.silent) {
        emitPrompt({ reason: 'native', update })
      }
      emit()
      return getStatus()
    }

    if (downloadedVersion && downloadedVersion === update.version) {
      kind = 'ready'
      if (options?.allowPrompt !== false && !options?.silent) {
        emitPrompt({ reason: 'ready', version: downloadedVersion })
      }
      emit()
      return getStatus()
    }

    if (!isNewer(update.version, currentVersion)) {
      kind = 'none'
      available = null
      setBadgeFlag(false)
      emit()
      return getStatus()
    }

    kind = 'web'
    const dismissed = dismissedVersion() === update.version
    if (dismissed) setBadgeFlag(true)

    if (options?.allowPrompt !== false && !options?.silent && !dismissed) {
      emitPrompt({ reason: 'update', update, kind: 'web' })
    } else if (
      dismissed &&
      !downloading &&
      !downloadedVersion &&
      (await isWifi())
    ) {
      try {
        await downloadBundle(update)
      } catch (error) {
        lastError =
          error instanceof Error
            ? error.message
            : 'Не удалось скачать обновление'
        kind = 'web'
        emit()
      }
    }

    emit()
    return getStatus()
  } catch (error) {
    lastError =
      error instanceof Error ? error.message : 'Ошибка проверки обновлений'
    emit()
    return getStatus()
  } finally {
    checking = false
  }
}

export const appUpdater: AppUpdater = {
  supported: Capacitor.isNativePlatform(),

  getStatus,

  subscribe(listener) {
    listeners.add(listener)
    listener(getStatus())
    return () => {
      listeners.delete(listener)
    }
  },

  getChannel: readChannel,

  async setChannel(channel) {
    writeChannel(channel)
    setDismissedVersion(null)
    setBadgeFlag(false)
    available = null
    kind = 'none'
    emit()
    return checkInternal({ silent: true, allowPrompt: false })
  },

  check(options) {
    return checkInternal({
      silent: options?.silent,
      allowPrompt: !options?.silent
    })
  },

  async download() {
    if (!available) {
      await checkInternal({ silent: true, allowPrompt: false })
    }
    if (!available) {
      lastError = 'Нет доступного обновления'
      emit()
      return getStatus()
    }
    if (kind === 'native') {
      lastError = 'Нужно обновление из RuStore'
      emit()
      return getStatus()
    }
    try {
      await downloadBundle(available)
    } catch (error) {
      lastError =
        error instanceof Error ? error.message : 'Не удалось скачать обновление'
      kind = 'web'
      progress = null
      emit()
    }
    return getStatus()
  },

  async apply() {
    await ensureReady()
    if (!downloadedVersion) {
      const status = await appUpdater.download()
      if (!status.downloadedVersion) {
        throw new Error(status.lastError || 'Нет скачанного обновления')
      }
    }

    const version = downloadedVersion
    if (!version) throw new Error('Нет скачанного обновления')

    const list = await CapacitorUpdater.list()
    let bundle = list.bundles.find((item) => item.version === version)
    if (!bundle) {
      if (!available) {
        throw new Error('Нет скачанного обновления')
      }
      bundle = await CapacitorUpdater.download({
        version: available.version,
        url: available.url,
        checksum: available.checksum
      })
    }

    setBadgeFlag(false)
    setDismissedVersion(null)
    await CapacitorUpdater.set(bundle)
  },

  async reset() {
    try {
      await CapacitorUpdater.reset()
      await CapacitorUpdater.reload()
    } catch (error) {
      // reset без reload, если builtin уже активен
      console.warn('reset bundles', error)
    }
    downloadedVersion = null
    available = null
    kind = 'none'
    progress = null
    setBadgeFlag(false)
    setDismissedVersion(null)
    await refreshBundleInfo()
    emit()
    return getStatus()
  },

  dismiss() {
    if (available) setDismissedVersion(available.version)
    setBadgeFlag(Boolean(available))
    emit()
    void (async () => {
      if (available && (await isWifi()) && !downloadedVersion && !downloading) {
        try {
          await downloadBundle(available)
        } catch (error) {
          lastError =
            error instanceof Error
              ? error.message
              : 'Фоновая загрузка не удалась'
          kind = 'web'
          emit()
        }
      }
    })()
    return getStatus()
  },

  clearBadge() {
    setBadgeFlag(false)
    emit()
    return getStatus()
  },

  debugOpenPrompt(options?: AppUpdaterDebugPromptOptions) {
    if (options?.force || !available) {
      emitPrompt({
        reason: 'debug',
        update: {
          version: available?.version || '1.4.0',
          notes:
            available?.notes ||
            'Так выглядит предложение обновить интерфейс. Сейчас это только демо для разработчиков.',
          minNative: available?.minNative ?? nativeVersionCode,
          channel: readChannel(),
          url: available?.url || '',
          checksum: available?.checksum || ''
        }
      })
      return
    }
    if (kind === 'native' && available) {
      emitPrompt({ reason: 'native', update: available })
      return
    }
    if (kind === 'ready' && downloadedVersion) {
      emitPrompt({ reason: 'ready', version: downloadedVersion })
      return
    }
    if (available) {
      emitPrompt({ reason: 'update', update: available, kind: 'web' })
    }
  },

  async debugForceDownload() {
    setDismissedVersion(null)
    await checkInternal({ silent: true, allowPrompt: false })
    return appUpdater.download()
  }
}

export { APP_UPDATE_PROMPT_EVENT, APP_UPDATE_STATUS_EVENT }

/** Старт: только подтвердить бандл. Сеть — позже, через guardian. */
export const startAppUpdater = async () => {
  if (!Capacitor.isNativePlatform()) return
  await ensureReady()
  await refreshBundleInfo()
  emit()
}
