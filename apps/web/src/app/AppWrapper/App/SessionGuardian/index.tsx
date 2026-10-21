import { diaryApi, getSavedAccount, hasSavedCredentials } from '@runtime-api'
import { useDiaryRegion, useLoginDiagnostics } from '@store'
import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import { useEffect, useRef } from 'react'
import {
  clearAuthData,
  DIARY_REQUEST_FAILED_EVENT,
  hasAuthData,
  isApiError
} from '../../../../shared'
import { MODAL_PAGE_LOGIN_DIAGNOSTICS } from '../../../../shared/config'

const checkSession = async (): Promise<'alive' | 'expired' | 'unknown'> => {
  try {
    const probe = await diaryApi.getAds()
    if (!isApiError(probe)) return 'alive'
    return probe.status === 401 ? 'expired' : 'unknown'
  } catch {
    return 'unknown'
  }
}

const SessionGuardian = () => {
  const routeNavigator = useRouteNavigator()
  const { modal } = useActiveVkuiLocation()
  const { selectedUrl } = useDiaryRegion()
  const { openDiagnostics } = useLoginDiagnostics()

  const modalRef = useRef(modal)
  modalRef.current = modal
  const regionRef = useRef(selectedUrl)
  regionRef.current = selectedUrl
  const openRef = useRef(openDiagnostics)
  openRef.current = openDiagnostics
  const handling = useRef(false)
  const lastNetworkFailureAt = useRef(0)

  useEffect(() => {
    const onRequestFailed = async (event: Event) => {
      const status =
        Number((event as CustomEvent<{ status?: unknown }>).detail?.status) || 0
      if (
        handling.current ||
        modalRef.current === MODAL_PAGE_LOGIN_DIAGNOSTICS ||
        !hasAuthData()
      ) {
        return
      }

      // Разовый сбой сети - только снекбар, модалка на повторе.
      // 4xx кроме 401 и 429 - не наша поляна, шаги будут зелёными.
      if (status !== 401) {
        if (status !== 0 && status < 500) return
        const now = Date.now()
        const firstTime = now - lastNetworkFailureAt.current > 120_000
        lastNetworkFailureAt.current = now
        if (firstTime) return
        handling.current = true
        try {
          openRef.current({
            reason: 'network',
            diaryUrl: regionRef.current,
            detail: 'Повторная ошибка запроса внутри приложения',
            login: null,
            passwordHash: null,
            getPassword: null
          })
          await routeNavigator.showModal(MODAL_PAGE_LOGIN_DIAGNOSTICS)
        } finally {
          handling.current = false
        }
        return
      }

      handling.current = true
      try {
        const session = await checkSession()
        if (session === 'alive') return

        if (session === 'unknown') {
          openRef.current({
            reason: 'network',
            diaryUrl: regionRef.current,
            detail: 'Сессия не проверена - дневник не отвечает',
            login: null,
            passwordHash: null,
            getPassword: null
          })
          await routeNavigator.showModal(MODAL_PAGE_LOGIN_DIAGNOSTICS)
          return
        }

        const account = await getSavedAccount()
        if (!account || !(await hasSavedCredentials())) {
          clearAuthData()
          await routeNavigator.replace('/')
          return
        }
        openRef.current({
          reason: 'session',
          diaryUrl: account.diaryUrl,
          detail: 'Сессия дневника истекла',
          login: account.login,
          passwordHash: null,
          getPassword: null
        })
        await routeNavigator.showModal(MODAL_PAGE_LOGIN_DIAGNOSTICS)
      } finally {
        handling.current = false
      }
    }

    window.addEventListener(DIARY_REQUEST_FAILED_EVENT, onRequestFailed)
    return () =>
      window.removeEventListener(DIARY_REQUEST_FAILED_EVENT, onRequestFailed)
  }, [routeNavigator])

  return null
}

export default SessionGuardian
