import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import { View, useAdaptivityConditionalRender } from '@vkontakte/vkui'
import { Epic as VKUIEpic } from '@vkontakte/vkui/dist/components/Epic/Epic'
import {
  MAIN_SETTINGS,
  VIEW_MARKS,
  VIEW_NOTIFICATIONS,
  VIEW_SCHEDULE,
  VIEW_SETTINGS
} from '../../../routes'

import {
  Achievements,
  LoginForm,
  Notifications,
  Schedule,
  Settings
} from '../../../../pages'

import type { Pages } from '../../../../shared/types.ts'

import type { FC } from 'react'
import Tabbar from './Tabbar'

interface IEpic {
  onStoryChange: (current: Pages) => void
}

const Epic: FC<IEpic> = ({ onStoryChange }) => {
  const { view: activeView, panel } = useActiveVkuiLocation()
  const { viewWidth } = useAdaptivityConditionalRender()
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation()
  const routeNavigator = useRouteNavigator()
  return (
    <VKUIEpic
      activeStory={activeView}
      tabbar={
        viewWidth.tabletMinus && (
          <Tabbar onStoryChange={onStoryChange} activeView={panel as Pages} />
        )
      }
    >
      <View
        id={VIEW_SCHEDULE}
        history={panelsHistory}
        activePanel={activePanel}
        onSwipeBack={() => routeNavigator.back()}
      >
        <LoginForm id={MAIN_SETTINGS} />
        <Schedule id={VIEW_SCHEDULE} />
        <Achievements id={VIEW_MARKS} />
        <Notifications id={VIEW_NOTIFICATIONS} />
        <Settings id={VIEW_SETTINGS} />
      </View>
    </VKUIEpic>
  )
}

export default Epic
