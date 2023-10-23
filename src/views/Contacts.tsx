import {
  Avatar, Card, Div, Footer, Footnote, Group, Header, Link, Panel, SimpleCell, View,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Icon28Hearts2Outline, Icon28Users } from '@vkontakte/icons';
import { FC } from 'preact/compat';
import PanelHeaderWithBack from '../components/UI/PanelHeaderWithBack';
import HelpAccordion from '../components/HelpAccordion';
import { helpData } from '../components/data';
//@ts-ignore типы React не совсем совместимы с Preact
import winxAva from '../assets/winx48.webp';
//@ts-ignore типы React не совсем совместимы с Preact
import scffsAva from '../assets/ava.jpg';

const Contacts: FC<{ id: string }> = ({ id }) => {
  const { panel: activePanel, panelsHistory } = useActiveVkuiLocation();
  const routeNavigator = useRouteNavigator();

  return (
    <View
      id={id}
      history={panelsHistory}
      activePanel={activePanel}
      onSwipeBack={() => routeNavigator.back()}
    >
      <Panel nav={id}>
        <PanelHeaderWithBack title='Помощь' />
        <Div>
          <Group header={<Header mode='tertiary'>FAQ</Header>}>
            <Card mode='shadow'>
              {helpData.map(({ detail, title, id: dataId }) => (
                <HelpAccordion key={id} id={dataId} detail={detail} title={title} />
              ))}
            </Card>
          </Group>
          <Group header={<Header mode='tertiary'>Контакты</Header>}>
            <SimpleCell
              before={<Avatar size={48} fallbackIcon={<Icon28Users />} src={scffsAva} />}
              subtitle='Разработчик | Любые вопросы'
              style={{ borderRadius: '5px !important' }}
            >
              <Link target='_blank' href='https://vk.com/scffs'>
                Семён Окулов
              </Link>
            </SimpleCell>
            <SimpleCell
              before={<Avatar size={48} fallbackIcon={<Icon28Users />} src={winxAva} />}
              subtitle='Наша группа | Любые вопросы'
              style={{ borderRadius: '5px !important' }}
            >
              <Link target='_blank' href='https://vk.com/diary_spo'>
                Дневник СПО
              </Link>
            </SimpleCell>
          </Group>
          <Footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/*//@ts-ignore типы React не совсем совместимы с Preact*/}
            <Footnote style={{ marginRight: 5 }}>made with</Footnote>
            <Icon28Hearts2Outline />
          </Footer>
        </Div>
      </Panel>
    </View>
  );
};

export default Contacts;
