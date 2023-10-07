import { FC } from 'react';
import {
  Avatar, Card, Div, Footer, Footnote, Group, Header, Link, SimpleCell,
} from '@vkontakte/vkui';
import { Icon28Users, Icon28Hearts2Outline } from '@vkontakte/icons';
import PanelHeaderWithBack from '../components/UI/PanelHeaderWithBack';
import HelpAccordion from '../components/HelpAccordion';
import { helpData } from '../components/data';
import winxAva from '../assets/winx48.webp';
import scffsAva from '../assets/ava.jpg';

const Contacts: FC = () => (
  <>
    <PanelHeaderWithBack title='Помощь' />
    <Div>
      <Group header={<Header mode='tertiary'>FAQ</Header>}>
        <Card mode='shadow'>
          {helpData.map(({ detail, title, id }) => (
            <HelpAccordion key={id} id={id} detail={detail} title={title} />
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
        <Footnote style={{ marginRight: 5 }}>made with</Footnote>
        <Icon28Hearts2Outline />
      </Footer>
    </Div>
  </>
);

export default Contacts;
