import { Pages } from '@types'
import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import { View, useAdaptivityConditionalRender } from '@vkontakte/vkui'
import { Epic as VKUIEpic } from '@vkontakte/vkui/dist/components/Epic/Epic'
import { FC } from 'preact/compat'
import {
  MAIN_SETTINGS,
  VIEW_MARKS,
  VIEW_NOTIFICATIONS,
  VIEW_SCHEDULE,
  VIEW_SETTINGS
} from '../../../../routes'

import {
  Achievements,
  LoginForm,
  Notifications,
  Schedule,
  Settings
} from '../../../../views'

import { Suspense } from '@components'
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
        <Suspense id={MAIN_SETTINGS} mode='screen'>
          <LoginForm id={MAIN_SETTINGS} />
        </Suspense>
        <Suspense id={VIEW_SCHEDULE} mode='screen'>
          <Schedule id={VIEW_SCHEDULE} />
        </Suspense>
        <Suspense id={VIEW_MARKS} mode='screen'>
          <Achievements id={VIEW_MARKS} />
        </Suspense>
        <Suspense id={VIEW_NOTIFICATIONS} mode='screen'>
          <Notifications id={VIEW_NOTIFICATIONS} />
        </Suspense>
        <Suspense id={VIEW_SETTINGS} mode='screen'>
          <Settings id={VIEW_SETTINGS} />
        </Suspense>
      </View>
    </VKUIEpic>
  )
}

export default Epic
