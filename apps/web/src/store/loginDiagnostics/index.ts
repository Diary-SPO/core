import { useSyncExternalStore } from 'react'

import { createStore } from '../store'

export type LoginDiagnosticsReason =
  | 'shape'
  | 'repeated'
  | 'network'
  | 'session'

interface LoginDiagnosticsState {
  reason: LoginDiagnosticsReason | null
  diaryUrl: string
  detail: string | null
  login: string | null
  passwordHash: string | null
  getPassword: (() => string) | null
}

const diagnosticsStore = createStore<LoginDiagnosticsState>({
  initialState: {
    reason: null,
    diaryUrl: '',
    detail: null,
    login: null,
    passwordHash: null,
    getPassword: null
  }
})

export const useLoginDiagnostics = () => {
  const state = useSyncExternalStore(
    diagnosticsStore.subscribe,
    diagnosticsStore.getState
  )

  return {
    ...state,
    openDiagnostics: (patch: LoginDiagnosticsState) =>
      diagnosticsStore.setState(patch),
    // Секреты живут только пока открыта модалка.
    closeDiagnostics: () =>
      diagnosticsStore.setState({
        ...diagnosticsStore.getState(),
        reason: null,
        detail: null,
        login: null,
        passwordHash: null,
        getPassword: null
      })
  }
}
