import { PanelHeaderWithBack } from '@components'
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

import { diaryAva, winxAva } from '../../images/config.ts'
import HelpAccordion from './HelpAccordion.tsx'
import { helpData } from './data.ts'

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
        {/*// @ts-ignore Типы не совместимы */}
        <SimpleCell
          before={
            // @ts-ignore Типы не совместимы
            <Avatar size={48} fallbackIcon={<Icon28Users />} src={winxAva} />
          }
          subtitle='Наша группа | Любые вопросы'
        >
          {/*// @ts-ignore Типы не совместимы */}
          <Link target='_blank' href='https://vk.com/diary_spo'>
            Дневник СПО
          </Link>
        </SimpleCell>
        {/*// @ts-ignore Типы не совместимы */}
        <SimpleCell
          before={
            // @ts-ignore Типы не совместимы
            <Avatar size={48} fallbackIcon={<Icon28Users />} src={diaryAva} />
          }
          subtitle='Исходный код на GitHub'
        >
          {/*// @ts-ignore Типы не совместимы */}
          <Link target='_blank' href='https://github.com/Diary-SPO'>
            Diary SPO
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
