import {
  Avatar,
  Flex,
  Group,
  Header,
  ModalPage,
  ModalPageHeader,
  Separator,
  SimpleCell,
  Spacing
} from '@vkontakte/vkui'
import { useUserEditModal } from '../../../../../../store/userEditModal'
const urls = [
  'https://mangabuff.ru/img/avatars/x150/806.gif',
  'https://mangabuff.ru/img/avatars/x150/1209.gif',
  'https://mangabuff.ru/img/avatars/x150/689.jpg',
  'https://mangabuff.ru/img/avatars/x150/688.jpg',
  'https://mangabuff.ru/img/avatars/x150/685.gif',
  'https://mangabuff.ru/img/avatars/x150/682.jpg',
  'https://mangabuff.ru/img/avatars/x150/476.jpg',
  'https://mangabuff.ru/img/avatars/x150/477.jpg',
  'https://mangabuff.ru/img/avatars/x150/478.jpg',
  'https://mangabuff.ru/img/avatars/x150/479.jpg',
  'https://mangabuff.ru/img/avatars/x150/480.jpg',
  'https://mangabuff.ru/img/avatars/x150/482.jpg',
  'https://mangabuff.ru/img/avatars/x150/483.jpg',
  'https://mangabuff.ru/img/avatars/x150/484.jpg',
  'https://mangabuff.ru/img/avatars/x150/485.jpg',
  'https://mangabuff.ru/img/avatars/x150/652.jpg'
]

const UserEditModal = ({ id }: { id: string }) => {
  const { modalData } = useUserEditModal()
  return (
    <ModalPage id={id} size={500} dynamicContentHeight>
      <ModalPageHeader>Сменить аву</ModalPageHeader>
      <Group>
        <Group header={<Header mode='secondary'>Текущая ава</Header>}>
          <SimpleCell before={<Avatar src={urls[0]} />}>
            {modalData.name}
          </SimpleCell>
        </Group>

        <Spacing size={24}>
          <Separator />
        </Spacing>

        <Flex margin='auto' gap='2xl' justify='center'>
          {urls.map((url, index) => (
            <Avatar key={index} size={110} src={url} />
          ))}
        </Flex>
      </Group>
    </ModalPage>
  )
}

export default UserEditModal
