import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import {
  useAdaptivityConditionalRender,
  View,
  Epic as VKUIEpic
} from '@vkontakte/vkui'
import type { FC } from 'react'
import {
  Achievements,
  LoginForm,
  Notifications,
  Schedule
} from '../../../../pages'
import Settings, {
  AboutSettings,
  AccountSettings,
  AppearanceSettings,
  AppSettings,
  DeveloperSettings,
  HelpSettings,
  NotificationsSettings
} from '../../../../pages/Settings'
import type { Pages } from '../../../../shared/types.ts'
import {
  MAIN_SETTINGS,
  VIEW_MARKS,
  VIEW_NOTIFICATIONS,
  VIEW_SCHEDULE,
  VIEW_SETTINGS,
  VIEW_SETTINGS_ABOUT,
  VIEW_SETTINGS_ACCOUNT,
  VIEW_SETTINGS_APP,
  VIEW_SETTINGS_APPEARANCE,
  VIEW_SETTINGS_DEVELOPER,
  VIEW_SETTINGS_HELP,
  VIEW_SETTINGS_NOTIFICATIONS
} from '../../../routes'
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
      activeStory={activeView ?? VIEW_SCHEDULE}
      tabbar={
        viewWidth.tabletMinus && (
          <Tabbar onStoryChange={onStoryChange} activePanel={panel} />
        )
      }
    >
      <View
        id={VIEW_SCHEDULE}
        history={panelsHistory}
        activePanel={activePanel ?? VIEW_SCHEDULE}
        onSwipeBack={() => routeNavigator.back()}
      >
        <LoginForm id={MAIN_SETTINGS} />
        <Schedule id={VIEW_SCHEDULE} />
        <Achievements id={VIEW_MARKS} />
        <Notifications id={VIEW_NOTIFICATIONS} />
        <Settings id={VIEW_SETTINGS} />
        <AppSettings id={VIEW_SETTINGS_APP} />
        <AppearanceSettings id={VIEW_SETTINGS_APPEARANCE} />
        <NotificationsSettings id={VIEW_SETTINGS_NOTIFICATIONS} />
        <AccountSettings id={VIEW_SETTINGS_ACCOUNT} />
        <HelpSettings id={VIEW_SETTINGS_HELP} />
        <AboutSettings id={VIEW_SETTINGS_ABOUT} />
        <DeveloperSettings id={VIEW_SETTINGS_DEVELOPER} />
      </View>
    </VKUIEpic>
  )
}

export default Epic
