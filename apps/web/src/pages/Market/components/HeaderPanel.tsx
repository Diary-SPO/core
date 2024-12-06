import { Icon28DiamondOutline } from '@vkontakte/icons'
import {
  Avatar,
  Button,
  ButtonGroup, Div,
  Group,
  RichCell, Skeleton,
  Tooltip
} from '@vkontakte/vkui'
import {FC, useState} from 'react'

const urls = [
  'https://mangabuff.ru/img/avatars/x150/806.gif'
]

interface Props {
  isError: boolean
  isLoading: boolean
}

export const HeaderPanel: FC<Props> = ({
  isLoading,
  isError
}) => {
  const [selectAva] = useState(urls[0])
  return (
    <Group>
      {
        isLoading ?
          (
            <RichCell
            before={<Skeleton width={48} height={48} borderRadius={100}/>}
            extraSubtitle={<Skeleton width={100} height={18}/>}
            after={
              <label>
                <Skeleton width={40} height={18}/>{' '}
                <Skeleton width={17} height={18}/>
              </label>
            }
            actions={
              <Skeleton width={157} height={30}/>
            }
            >
              <Skeleton width={131} height={20}/>
            </RichCell>
          ) :
            (
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
                <Tooltip
                  placement='right'
                  description='История списания и зачисления кредитов'
                >
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
            )
      }
    </Group>
  )
}