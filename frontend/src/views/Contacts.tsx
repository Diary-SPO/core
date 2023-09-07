import { FC } from 'react';
import {
  Group, Header, Panel, View,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

import PanelHeaderWithBack from '../components/PanelHeaderWithBack';
import HelpAccordion from '../components/HelpAccordion';

import { helpData } from '../components/data';

const Contacts: FC<{ id: string }> = ({ id }) => {
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
        <PanelHeaderWithBack title='Помощь' />
        <Group header={<Header mode='secondary'>FAQ</Header>}>
          {helpData.map(({ detail, title, id }) => (
            <HelpAccordion key={id} id={id} detail={detail} title={title} />
          ))}
        </Group>
      </Panel>
    </View>
  );
};

export default Contacts;
