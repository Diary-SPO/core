import { FC, lazy } from 'react';
import { Panel, View } from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

import PanelHeaderWithBack from '../components/UI/PanelHeaderWithBack';
import Suspense from '../components/UI/Suspense';

const MarksByGroup = lazy(() => import('../components/MarksByGroup'));
const UserInfo = lazy(() => import('../components/UserInfo'));

const Marks: FC<{ id: string }> = ({ id }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();

  return (
    <View
      id={id}
      history={panelsHistory}
      activePanel={activePanel as string}
      onSwipeBack={() => routeNavigator.back()}
    >
      <Panel nav={id}>
        <PanelHeaderWithBack title='Успеваемость' />
        <Suspense id='UserInfo'>
          <UserInfo />
        </Suspense>
        <Suspense id='MarksByGroup'>
          <MarksByGroup />
        </Suspense>
      </Panel>
    </View>
  );
};

export default Marks;
