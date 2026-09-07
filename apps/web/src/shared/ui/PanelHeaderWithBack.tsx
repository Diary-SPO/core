import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import { PanelHeader, PanelHeaderBack } from '@vkontakte/vkui'

import type { FC } from 'react'
import { MAIN_SETTINGS } from '../../app/routes'
import { BETA_VERSION, IS_DEV } from '../config'

interface PanelHeaderWithBackProps {
  title: string
  showBack?: boolean
}

export const PanelHeaderWithBack: FC<PanelHeaderWithBackProps> = ({
  title,
  showBack = true
}) => {
  const routeNavigator = useRouteNavigator()
  const { panel } = useActiveVkuiLocation()

  const isLoginForm = panel === MAIN_SETTINGS

  return (
    <PanelHeader
      before={
        showBack &&
        !isLoginForm && (
          <PanelHeaderBack onClick={() => routeNavigator.back()} />
        )
      }
    >
      {title} {IS_DEV && `[Beta ${BETA_VERSION}]`}
    </PanelHeader>
  )
}
