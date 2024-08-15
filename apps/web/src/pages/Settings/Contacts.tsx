import { Icon28Users } from '@vkontakte/icons'
import { Avatar, Group, Header, Link, SimpleCell } from '@vkontakte/vkui'
import { diaryAva, winxAva } from '../../shared/config/images.ts'

const Contacts = () => {
  return (
    <Group header={<Header mode='tertiary'>Контакты</Header>}>
      <SimpleCell
        before={
          <Avatar size={48} fallbackIcon={<Icon28Users />} src={winxAva} />
        }
        subtitle='Наша группа | Любые вопросы'
      >
        <Link target='_blank' href='https://vk.com/diary_spo'>
          Дневник СПО
        </Link>
      </SimpleCell>
      <SimpleCell
        before={
          <Avatar size={48} fallbackIcon={<Icon28Users />} src={diaryAva} />
        }
        subtitle='Исходный код на GitHub'
      >
        <Link target='_blank' href='https://github.com/Diary-SPO'>
          Diary SPO
        </Link>
      </SimpleCell>
    </Group>
  )
}

export default Contacts
