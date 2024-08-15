import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import { Panel, View } from '@vkontakte/vkui'
import type { FC, PropsWithChildren } from 'react'

import { unreachable } from '../../../shared'
import { PanelHeaderWithBack } from '../../../shared/ui'

interface Props extends PropsWithChildren {
  id: string
}

export const Layout: FC<Props> = ({ id, children, ...rest }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation()
  const routeNavigator = useRouteNavigator()

  if (!activePanel) {
    unreachable()
    return
  }

  return (
    <View
      id={id}
      history={panelsHistory}
      activePanel={activePanel}
      onSwipeBack={() => routeNavigator.back()}
      {...rest}
    >
      <Panel nav={id}>
        <PanelHeaderWithBack title='Главная' />
        {children}
      </Panel>
    </View>
  )
}
