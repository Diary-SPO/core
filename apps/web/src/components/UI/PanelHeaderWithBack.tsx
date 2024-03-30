import { FunctionalComponent } from 'preact'
import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import { PanelHeader, PanelHeaderBack } from '@vkontakte/vkui'

import { MAIN_SETTINGS } from '@routes'
import { BETA_VERSION, IS_DEV } from '@config'

const PanelHeaderWithBack: FunctionalComponent<{ title: string }> = ({
  title
}) => {
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
      {title} {IS_DEV && `[Beta ${BETA_VERSION}]`}
    </PanelHeader>
  )
}

export default PanelHeaderWithBack
