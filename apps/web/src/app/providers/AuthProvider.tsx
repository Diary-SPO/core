import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import { type ReactNode, useLayoutEffect } from 'react'

import { MAIN_SETTINGS, PAGE_SCHEDULE } from '../routes'

// @TODO: refactor this
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const routeNavigator = useRouteNavigator()
  const { view: activeView, panel } = useActiveVkuiLocation()

  // biome-ignore lint/correctness/useExhaustiveDependencies: all good
  useLayoutEffect(() => {
    const cookieValue = localStorage.getItem('token')

    const onRoute = async () => {
      if (!cookieValue) {
        await routeNavigator.replace('/')
        return
      }

      if (panel === MAIN_SETTINGS) {
        await routeNavigator.replace(PAGE_SCHEDULE)
        return
      }

      return
    }

    onRoute()
  }, [activeView, panel])

  return children
}

export default AuthProvider
