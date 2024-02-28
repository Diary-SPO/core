import { PanelHeaderWithBack } from '@components'
import { Icon28Users } from '@vkontakte/icons'
import { Avatar, Group, Header, Link, Panel, SimpleCell } from '@vkontakte/vkui'
import { FunctionalComponent } from 'preact'
import { diaryAva, winxAva } from '../../images/config.ts'
import { Props } from '../types.ts'
import Actions from './Actions'
import FAQ from './FAQ'
import Footer from './Footer'

const Settings: FunctionalComponent<Props> = ({ id }) => {
  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title='Настройки' />

      <FAQ />

      <Actions />

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

      <Footer />
    </Panel>
  )
}

export default Settings
