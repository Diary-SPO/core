import { FC } from 'react';
import {
  Group, Link, Panel, Placeholder, View,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Icon28MailOutline } from '@vkontakte/icons';

import PanelHeaderWithBack from '../components/PanelHeaderWithBack';

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
        <PanelHeaderWithBack title='Контакты' />
        <Group>
          <Placeholder
            icon={<Icon28MailOutline width={56} height={56} />}
          >
            Страница ещё не готова, но вы можете написать в
            {' '}
            <Link href='https://vk.me/dnevnik_spo' target='_blank'>группу ВК</Link>
          </Placeholder>
        </Group>
      </Panel>
    </View>
  );
};

export default Contacts;
