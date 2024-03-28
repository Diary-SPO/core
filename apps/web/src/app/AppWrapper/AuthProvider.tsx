import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import { VNode } from 'preact'
import { useLayoutEffect } from 'preact/hooks'

import { MAIN_SETTINGS, PAGE_SCHEDULE } from '@routes'

const AuthProvider = ({ children }: { children: VNode }) => {
  const routeNavigator = useRouteNavigator()
  const { view: activeView, panel } = useActiveVkuiLocation()

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
