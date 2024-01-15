import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import { PanelHeader, PanelHeaderBack } from '@vkontakte/vkui'
import { FunctionalComponent, VNode } from 'preact'
import { MAIN_SETTINGS } from '../../routes'

const PanelHeaderWithBack: FunctionalComponent<{
  title?: string
  children?: VNode
}> = ({ title, children }) => {
  const routeNavigator = useRouteNavigator()
  const { panel } = useActiveVkuiLocation()

  const isLoginForm = panel === MAIN_SETTINGS

  return (
    <PanelHeader
      before={
        !isLoginForm && (
          // @ts-ignore Типы не совместимы
          <PanelHeaderBack onClick={() => routeNavigator.back()} />
        )
      }
    >
      {title}
      {children}
    </PanelHeader>
  )
}

export default PanelHeaderWithBack
