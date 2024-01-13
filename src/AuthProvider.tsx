import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import { Div, FormStatus } from '@vkontakte/vkui'
import { VNode } from 'preact'
import { useLayoutEffect } from 'preact/hooks'
import { MAIN_SETTINGS, PAGE_SCHEDULE } from './routes'

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
  
  /** @beta BETA ONLY */
  const isMobile = window.innerWidth < 760

  return (
    <>
      {/** @beta BETA ONLY */}
      {isMobile && (
        <Div>
          <FormStatus style={{ marginTop: 60 }} header='Дневник СПО Beta'>
            Самые новые возможности и баги только тут, удачи!
          </FormStatus>
        </Div>
      )}
      {children}
    </>
  )
}

export default AuthProvider
