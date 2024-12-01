import {
  Avatar,
  Flex,
  Group,
  Header,
  ModalPage,
  ModalPageHeader
} from '@vkontakte/vkui'
import './index.css'
import { Icon16DoneCircle, Icon56MarketOutline } from '@vkontakte/icons'
import { useState } from 'react'

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
  const [selectAva, setSelectAva] = useState(urls[0])

  const selectCurrAva = (url: string) => {
    setSelectAva(url)
  }
  return (
    <ModalPage id={id} size={500} dynamicContentHeight>
      <ModalPageHeader>Сменить аву</ModalPageHeader>
      <Group>
        {/*<Group>*/}
        {/*	<RichCell*/}
        {/*		before={<Avatar size={48} src={selectAva}/>}*/}
        {/*		caption="Вы великолепны 😉"*/}
        {/*		after={*/}
        {/*      <Tooltip text='Кредиты — это то, сколько вы нам должны'>*/}
        {/*        <label>*/}
        {/*          1 256{' '}*/}
        {/*          <Icon28MoneyWadOutline height={20} style={{*/}
        {/*            display: 'inline-block',*/}
        {/*            verticalAlign: 'text-top',*/}
        {/*          }}/>*/}
        {/*        </label>*/}
        {/*      </Tooltip>*/}
        {/*		}*/}
        {/*		afterCaption="Кредиты 👆"*/}
        {/*		actions={*/}
        {/*			<ButtonGroup mode="horizontal" gap="s" stretched>*/}
        {/*				<Tooltip text='История списания и зачисления кредитов'>*/}
        {/*					<Button*/}
        {/*						mode="secondary"*/}
        {/*						size="s">*/}
        {/*						История*/}
        {/*					</Button>*/}
        {/*				</Tooltip>*/}
        {/*			</ButtonGroup>*/}
        {/*		}*/}
        {/*		multiline*/}
        {/*	>*/}
        {/*		Евгений Малинин{' '}*/}
        {/*		<Icon20CheckShieldGreen*/}
        {/*			style={{*/}
        {/*				display: 'inline-block',*/}
        {/*				verticalAlign: 'text-top',*/}
        {/*			}}*/}
        {/*		/>*/}
        {/*	</RichCell>*/}
        {/*</Group>*/}

        <Group header={<Header mode='secondary'>Мои аватарки</Header>}>
          <Flex margin='auto' gap='2xl' justify='center'>
            {urls.map((url, index) => (
              <Avatar
                key={index}
                size={110}
                src={url}
                onClick={() => selectCurrAva(url)}
                className={selectAva === url ? 'select-avatar' : ''}
              >
                <Avatar.Badge
                  hidden={selectAva !== url}
                  className='select-avatar_badge'
                >
                  <Icon16DoneCircle height={25} width={25} />
                </Avatar.Badge>
              </Avatar>
            ))}
            <Avatar size={110}>
              <Icon56MarketOutline />
            </Avatar>
          </Flex>
        </Group>
      </Group>
    </ModalPage>
  )
}

export default UserEditModal
