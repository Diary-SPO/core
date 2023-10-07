import { FC } from 'react';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Panel, useAdaptivityConditionalRender, View } from '@vkontakte/vkui';
import { Epic as VKUIEpic } from '@vkontakte/vkui/dist/components/Epic/Epic';
import {
  MAIN_SETTINGS, VIEW_ATTESTATION, VIEW_CONTACTS, VIEW_MARKS, VIEW_NOTIFICATIONS, VIEW_SCHEDULE, VIEW_SETTINGS,
} from '../../routes';
import { Pages } from '../../types';

import Tabbar from './Tabbar';
import {
  Attestation, Contacts, LoginForm, Marks, Notifications, Schedule, Settings,
} from '../../views';

interface IEpic {
  onStoryChange: (current: Pages) => void
}

const Epic: FC<IEpic> = ({ onStoryChange }) => {
  const {
    view: activeView = 'profile' as Pages,
  } = useActiveVkuiLocation();
  const { viewWidth } = useAdaptivityConditionalRender();

  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();

  return (
    <VKUIEpic
      activeStory={activeView}
      tabbar={
        viewWidth.tabletMinus
        && <Tabbar onStoryChange={onStoryChange} activeView={activePanel as Pages} />
      }
    >
      <View
        id={MAIN_SETTINGS}
        history={panelsHistory}
        activePanel={activePanel as string}
        onSwipeBack={() => routeNavigator.back()}
      >
        <Panel id={MAIN_SETTINGS}>
          <LoginForm />
        </Panel>

        <Panel id={VIEW_SCHEDULE}>
          <Schedule />
        </Panel>

        <Panel id={VIEW_MARKS}>
          <Marks />
        </Panel>

        <Panel id={VIEW_ATTESTATION}>
          <Attestation />
        </Panel>

        <Panel id={VIEW_NOTIFICATIONS}>
          <Notifications />
        </Panel>

        <Panel id={VIEW_CONTACTS}>
          <Contacts />
        </Panel>

        <Panel id={VIEW_SETTINGS}>
          <Settings />
        </Panel>
      </View>
    </VKUIEpic>
  );
};

export default Epic;
