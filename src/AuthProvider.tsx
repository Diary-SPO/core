import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import { VNode } from 'preact'
import { useLayoutEffect } from 'react'
import { MAIN_SETTINGS, VIEW_SCHEDULE } from './routes'

const AuthProvider = ({ children }: { children: VNode }) => {
  const routeNavigator = useRouteNavigator()
  const { view: activeView, panel } = useActiveVkuiLocation()

  const cookieValue = localStorage.getItem('token')

  useLayoutEffect(() => {
    const onRoute = () => {
      if (!cookieValue) {
        routeNavigator.replace('/')
      } else if (cookieValue && panel === MAIN_SETTINGS) {
        routeNavigator.replace(`/${VIEW_SCHEDULE}`)
      }
    }

    onRoute()
  }, [activeView, panel])

  return children
}

export default AuthProvider
