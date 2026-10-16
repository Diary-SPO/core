import { DIARY_SOURCE, getDiaryDomain } from '../../../shared/config'
import type { LoginDiagnosticsReason } from '../../../store/loginDiagnostics'
import type { DiagnosticStepResult, RegionProbe } from './runDiagnostics'

export const SUPPORT_URL = 'https://vk.me/diary_spo'

const REASON_TEXT: Record<LoginDiagnosticsReason, string> = {
  shape: 'дневник ответил, но приложение не разобрало ответ',
  repeated: 'несколько неудачных попыток входа подряд',
  network: 'ошибка сети или сервера дневника',
  session: 'сессия дневника истекла'
}

const GREETING_TEXT: Record<LoginDiagnosticsReason, string> = {
  shape: 'Здравствуйте! Не получается войти в «Дневник СПО».',
  repeated: 'Здравствуйте! Не получается войти в «Дневник СПО».',
  network: 'Здравствуйте! Не получается войти в «Дневник СПО».',
  session:
    'Здравствуйте! Выкинуло из «Дневника СПО» прямо во время пользования.'
}

const STEP_MARK = { ok: '✓', warn: '!', fail: '✗' } as const

export const buildSupportReport = (args: {
  reason: LoginDiagnosticsReason
  diaryUrl: string
  detail: string | null
  steps: DiagnosticStepResult[]
  region: RegionProbe | null
}): string => {
  const lines = [
    GREETING_TEXT[args.reason],
    `Регион: ${getDiaryDomain(args.diaryUrl)}`,
    `Причина: ${REASON_TEXT[args.reason]}.`
  ]
  if (args.detail) lines.push(`Подробности: ${args.detail}`)
  if (args.steps.length > 0) {
    lines.push('Проверки:')
    for (const step of args.steps) {
      lines.push(`- ${step.label}: ${STEP_MARK[step.status]} ${step.detail}`)
    }
  }
  if (args.region?.foundUrl) {
    lines.push(
      `Подошёл регион: ${args.region.foundName} (${args.region.foundUrl})`
    )
  }
  if (args.region && args.region.results.length > 0) {
    lines.push('По регионам:')
    for (const result of args.region.results) {
      const domain = result.url.replace(/^https?:\/\//, '')
      const outcome =
        result.result === 'ok'
          ? 'вход'
          : result.result === 'denied'
            ? `отказ ${result.status ?? ''}`.trim()
            : 'недоступно'
      lines.push(`- ${domain}: ${outcome}`)
    }
  }
  lines.push(`Источник: ${DIARY_SOURCE}`, `Время: ${new Date().toISOString()}`)
  return lines.join('\n')
}

export const openSupportChat = async (report: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(report)
  } catch {
    // Буфер может быть недоступен - текст всё равно уйдёт в ссылку
  }
  window.open(
    `${SUPPORT_URL}?text=${encodeURIComponent(report.slice(0, 900))}`,
    '_blank',
    'noopener,noreferrer'
  )
}
