import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import { ReactNode } from 'preact/compat'
import { useEffect } from 'preact/hooks'
import {
  MAIN_SETTINGS,
  VIEW_SCHEDULE,
} from './routes'

const AuthProvider = ({ children }: {children: ReactNode}) => {
  const routeNavigator = useRouteNavigator()
  const { view: activeView, panel } = useActiveVkuiLocation()
 

  const cookieValue = localStorage.getItem('token')

  useEffect(() => {
    const onRoute = () => {
      if (!cookieValue) {
        routeNavigator.replace('/')
      } else if (cookieValue && panel === MAIN_SETTINGS) {
        routeNavigator.replace(`/${VIEW_SCHEDULE}`)
      }
      
    }

    onRoute()
  }, [activeView, window.location])
  
  return children
}

export default AuthProvider
