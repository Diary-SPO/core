import { FC } from 'react';
import {
  Card, Div, Group, Header, Panel, View,
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
        <Div>
          <Group header={<Header mode='tertiary'>FAQ</Header>}>
            <Card mode='shadow'>
              {helpData.map(({ detail, title, id }) => (
                <HelpAccordion key={id} id={id} detail={detail} title={title} />
              ))}
            </Card>
          </Group>
        </Div>
      </Panel>
    </View>
  );
};

export default Contacts;
