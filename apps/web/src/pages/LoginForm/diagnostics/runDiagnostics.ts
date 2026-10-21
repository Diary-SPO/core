import { b64 } from '@diary-spo/crypto'
import { findWorkingRegion, isVpnActive } from '@runtime-api'
import type { RegionProbeResult } from '../../../shared/api/runtime/types.ts'

import { DIARY_REGIONS, getDiaryDomain } from '../../../shared/config'

export type DiagnosticStepStatus = 'ok' | 'warn' | 'fail'

export interface DiagnosticStepResult {
  id: 'internet' | 'vpn' | 'diary' | 'storage' | 'region'
  label: string
  status: DiagnosticStepStatus
  detail: string
}

export interface RegionProbe {
  checked: boolean
  foundUrl: string | null
  foundName: string | null
  results: RegionProbeResult[]
}

export interface DiagnosticsInput {
  diaryUrl: string
  login?: string | null
  passwordHash?: string | null
  getPassword?: (() => string) | null
  onRegionProgress?: (checked: number, total: number) => void
}

export const DIAGNOSTIC_STEP_LABELS = [
  'Подключение к интернету',
  'VPN',
  'Дневник отвечает',
  'Хранилище приложения',
  'Поиск вашего региона'
] as const

const fetchWithTimeout = async (
  url: string,
  ms: number,
  init?: RequestInit
): Promise<number> => {
  const started = Date.now()
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  try {
    await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
  return Date.now() - started
}

const checkInternet = async (): Promise<DiagnosticStepResult> => {
  const base = {
    id: 'internet' as const,
    label: 'Подключение к интернету'
  }
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { ...base, status: 'fail', detail: 'Устройство офлайн' }
  }
  try {
    const ms = await fetchWithTimeout(
      'https://clients3.google.com/generate_204',
      8000,
      { mode: 'no-cors' }
    )
    return { ...base, status: 'ok', detail: `Соединение есть (${ms} мс)` }
  } catch {
    return {
      ...base,
      status: 'warn',
      detail: 'Проверить не вышло, но вход всё равно может работать'
    }
  }
}

const checkVpn = async (): Promise<DiagnosticStepResult> => {
  const base = { id: 'vpn' as const, label: 'VPN' }
  const { active, supported } = await isVpnActive()
  if (active) {
    return {
      ...base,
      status: 'warn',
      detail: 'VPN включён — дневник может отклонять вход, выключите его'
    }
  }
  return {
    ...base,
    status: 'ok',
    detail: supported ? 'VPN выключен' : 'Убедитесь вручную, что VPN выключен'
  }
}

const checkDiary = async (diaryUrl: string): Promise<DiagnosticStepResult> => {
  const base = { id: 'diary' as const, label: 'Дневник отвечает' }
  try {
    const ms = await fetchWithTimeout(diaryUrl, 10000, { mode: 'no-cors' })
    return { ...base, status: 'ok', detail: `Сервер на связи (${ms} мс)` }
  } catch {
    return {
      ...base,
      status: 'fail',
      detail: 'Сервер не отвечает — возможно, техработы в дневнике'
    }
  }
}

const checkStorage = (): DiagnosticStepResult => {
  const base = { id: 'storage' as const, label: 'Хранилище приложения' }
  try {
    localStorage.setItem('diagnostics-ping', 'pong')
    localStorage.removeItem('diagnostics-ping')
    return { ...base, status: 'ok', detail: 'Сессию есть куда сохранить' }
  } catch {
    return {
      ...base,
      status: 'fail',
      detail: 'Хранилище недоступно — вход не запомнится'
    }
  }
}

const probeRegion = async (
  input: DiagnosticsInput,
  diaryOk: boolean
): Promise<{ step: DiagnosticStepResult; probe: RegionProbe }> => {
  const base = { id: 'region' as const, label: 'Поиск вашего региона' }
  const idle: RegionProbe = {
    checked: false,
    foundUrl: null,
    foundName: null,
    results: []
  }
  // Пароль - только из поля ввода, никаких запомненных хешей.
  const freshPassword = input.getPassword?.() ?? ''
  const hash = freshPassword
    ? await b64(freshPassword)
    : (input.passwordHash ?? null)
  if (!input.login || !hash) {
    return {
      step: {
        ...base,
        status: 'ok',
        detail: 'Пропущен — нет данных для проверки'
      },
      probe: idle
    }
  }
  if (!diaryOk) {
    return {
      step: {
        ...base,
        status: 'ok',
        detail: 'Пропущен — сначала разберитесь с ошибками выше'
      },
      probe: idle
    }
  }
  return searchRegionAccount(
    input.login,
    hash,
    input.diaryUrl,
    input.onRegionProgress
  )
}

export const searchRegionAccount = async (
  login: string,
  passwordHash: string,
  diaryUrl: string,
  onProgress?: (checked: number, total: number) => void
): Promise<{ step: DiagnosticStepResult; probe: RegionProbe }> => {
  const base = { id: 'region' as const, label: 'Поиск вашего региона' }
  const { regionUrl, supported, checked, results } = await findWorkingRegion(
    login,
    passwordHash,
    DIARY_REGIONS.map((region) => region.url),
    onProgress,
    diaryUrl
  )
  if (!supported) {
    return {
      step: {
        ...base,
        status: 'ok',
        detail: 'Пропущен — доступно только в приложении'
      },
      probe: { checked: false, foundUrl: null, foundName: null, results: [] }
    }
  }
  if (!regionUrl) {
    const denied = results.filter((result) => result.result === 'denied').length
    const unreachable = results.filter(
      (result) => result.result === 'unreachable'
    )
    const unreachableDomains = unreachable
      .slice(0, 5)
      .map((result) => getDiaryDomain(result.url))
      .join(', ')
    return {
      step: {
        ...base,
        status: 'warn',
        detail:
          `В других регионах вход не прошёл (проверено ${checked}): ` +
          `отказ ${denied}, недоступно ${unreachable.length}` +
          (unreachableDomains ? ` (${unreachableDomains})` : '')
      },
      probe: { checked: true, foundUrl: null, foundName: null, results }
    }
  }
  const found = DIARY_REGIONS.find((region) => region.url === regionUrl)
  return {
    step: {
      ...base,
      status: 'ok',
      detail: `Вход прошёл в регионе «${found?.name ?? getDiaryDomain(regionUrl)}»`
    },
    probe: {
      checked: true,
      foundUrl: regionUrl,
      foundName: found?.name ?? getDiaryDomain(regionUrl),
      results
    }
  }
}

export const runLoginDiagnostics = async (
  input: DiagnosticsInput,
  onStep: (step: DiagnosticStepResult) => void
): Promise<{ steps: DiagnosticStepResult[]; region: RegionProbe }> => {
  const steps: DiagnosticStepResult[] = []
  const push = (step: DiagnosticStepResult) => {
    steps.push(step)
    onStep(step)
  }

  push(await checkInternet())
  push(await checkVpn())
  const diary = await checkDiary(input.diaryUrl)
  push(diary)
  push(checkStorage())
  const { step, probe } = await probeRegion(
    input,
    !steps.some((step) => step.status === 'fail')
  )
  push(step)

  return { steps, region: probe }
}
