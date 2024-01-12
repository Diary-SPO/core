import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import { VNode } from 'preact'
import { useLayoutEffect } from 'react'

const AuthProvider = ({ children }: { children: VNode }) => {
  const routeNavigator = useRouteNavigator()
  const { view: activeView, panel } = useActiveVkuiLocation()

  const cookieValue = localStorage.getItem('token')

  useLayoutEffect(() => {
    const onRoute = async () => {
      if (!cookieValue) {
        console.log('aaaaaa')
        await routeNavigator.replace('/')
      }
    }

    onRoute()
  }, [activeView, panel, window.location, window.history.length])

  return children
}

export default AuthProvider
