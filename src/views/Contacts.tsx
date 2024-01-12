import { HelpAccordion, PanelHeaderWithBack, helpData } from '@components'
import { Icon28Hearts2Outline, Icon28Users } from '@vkontakte/icons'
import {
  Avatar,
  Card,
  Div,
  Footer,
  Footnote,
  Group,
  Header,
  Link,
  Panel,
  SimpleCell
} from '@vkontakte/vkui'
import { FC } from 'preact/compat'

import winxAva from '../assets/winx48.webp'

const Contacts: FC<{ id: string }> = ({ id }) => (
  <Panel nav={id}>
    <PanelHeaderWithBack title='Помощь' />
    <Div>
      <Group header={<Header mode='tertiary'>FAQ</Header>}>
        <Card mode='shadow'>
          {helpData.map(({ detail, title, id: dataId }) => (
            <HelpAccordion
              key={dataId}
              id={dataId}
              detail={detail}
              title={title}
            />
          ))}
        </Card>
      </Group>
      <Group header={<Header mode='tertiary'>Контакты</Header>}>
        <SimpleCell
          before={
            <Avatar size={48} fallbackIcon={<Icon28Users />} src={winxAva} />
          }
          subtitle='Наша группа | Любые вопросы'
          style={{ borderRadius: '5px !important' }}
        >
          <Link target='_blank' href='https://vk.com/diary_spo'>
            Дневник СПО
          </Link>
        </SimpleCell>
      </Group>
      <Footer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/*//@ts-ignore типы React не совсем совместимы с Preact*/}
        <Footnote style={{ marginRight: 5 }}>made with</Footnote>
        <Icon28Hearts2Outline />
      </Footer>
    </Div>
  </Panel>
)

export default Contacts
