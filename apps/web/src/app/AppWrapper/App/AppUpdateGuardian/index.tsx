import { appUpdater } from '@runtime-api'
import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import { useEffect, useRef } from 'react'

import { MODAL_PAGE_APP_UPDATE } from '../../../../shared/config'
import {
  APP_UPDATE_PROMPT_EVENT,
  type AppUpdatePromptDetail,
  setPendingAppUpdatePrompt
} from '../../../../shared/utils/appUpdate'

const INITIAL_CHECK_DELAY_MS = 8_000

const AppUpdateGuardian = () => {
  const routeNavigator = useRouteNavigator()
  const { modal } = useActiveVkuiLocation()
  const openingRef = useRef(false)

  useEffect(() => {
    const onPrompt = (event: Event) => {
      const detail = (event as CustomEvent<AppUpdatePromptDetail>).detail
      if (!detail || openingRef.current) return

      setPendingAppUpdatePrompt(detail)

      if (modal === MODAL_PAGE_APP_UPDATE) return

      openingRef.current = true
      void routeNavigator
        .showModal(MODAL_PAGE_APP_UPDATE)
        .catch((error) => {
          console.warn('Unable to open update modal', error)
        })
        .finally(() => {
          openingRef.current = false
        })
    }

    window.addEventListener(APP_UPDATE_PROMPT_EVENT, onPrompt)
    return () => window.removeEventListener(APP_UPDATE_PROMPT_EVENT, onPrompt)
  }, [modal, routeNavigator])

  useEffect(() => {
    if (!appUpdater.supported) return

    const timer = window.setTimeout(() => {
      void appUpdater.check({ silent: false })
    }, INITIAL_CHECK_DELAY_MS)

    const onResume = () => {
      void appUpdater.check({ silent: true })
    }
    window.addEventListener('focus', onResume)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('focus', onResume)
    }
  }, [])

  return null
}

export default AppUpdateGuardian
