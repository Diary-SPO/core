import {Icon28DiamondOutline} from '@vkontakte/icons'
import {
  Avatar,
  Button,
  ButtonGroup,
  Group,
  RichCell,
  Tooltip
} from '@vkontakte/vkui'
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

const MarketHeader = () => {
  const [selectAva] = useState(urls[0])
  return (
    <Group>
      <RichCell
        before={<Avatar size={48} src={selectAva} />}
        extraSubtitle='Вы великолепны 😉'
        after={
          <Tooltip description='Алмазы — это то, что вы получаете за активность в приложении'>
            <label>
              1 256{' '}
              <Icon28DiamondOutline
                height={20}
                style={{
                  display: 'inline-block',
                  verticalAlign: 'text-top'
                }}
              />
            </label>
          </Tooltip>
        }
        actions={
          <ButtonGroup mode='horizontal' gap='s' stretched>
            <Tooltip placement='right' description='История списания и зачисления кредитов'>
              <Button mode='secondary' size='s'>
                История операций
              </Button>
            </Tooltip>
          </ButtonGroup>
        }
        multiline
      >
        Евгений Малинин{' '}
      </RichCell>
    </Group>
  )
}

export default MarketHeader
