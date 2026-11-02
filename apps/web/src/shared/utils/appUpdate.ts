import type { AppUpdateInfo, AppUpdateKind } from '../api/runtime/types'

export const APP_UPDATE_STATUS_EVENT = 'ota-update-status'
export const APP_UPDATE_PROMPT_EVENT = 'ota-update-prompt'

export type AppUpdatePromptDetail =
  | { reason: 'update'; update: AppUpdateInfo; kind: AppUpdateKind }
  | { reason: 'native'; update: AppUpdateInfo }
  | { reason: 'ready'; version: string }
  | { reason: 'debug'; update: AppUpdateInfo }

let pendingPrompt: AppUpdatePromptDetail | null = null

export const setPendingAppUpdatePrompt = (
  detail: AppUpdatePromptDetail | null
) => {
  pendingPrompt = detail
}

export const takePendingAppUpdatePrompt = (): AppUpdatePromptDetail | null => {
  const current = pendingPrompt
  pendingPrompt = null
  return current
}

export const peekPendingAppUpdatePrompt = (): AppUpdatePromptDetail | null =>
  pendingPrompt
