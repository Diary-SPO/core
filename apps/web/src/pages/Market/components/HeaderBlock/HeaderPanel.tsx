import { Icon28DiamondOutline } from '@vkontakte/icons'
import {
  Avatar,
  Button,
  ButtonGroup,
  Group,
  RichCell,
  Skeleton,
  Tooltip
} from '@vkontakte/vkui'
import { type FC } from 'react'
import {Nullable} from "@diary-spo/shared";
import {winxAva} from "../../../../shared/config/images.ts";
import {balanceFormatter} from "./balanceFormatter.tsx";
import {getUrlPath} from "../AvatarsBlock/getUrlPath.tsx";

interface Props {
  isLoading: boolean
  username: string
  avatar: Nullable<string>
  balance: number
}

export const HeaderPanel: FC<Props> = ({ isLoading, username, avatar, balance }) => {
  return (
    <Group>
      {isLoading ? (
        <RichCell
          before={<Skeleton width={48} height={48} borderRadius={100} />}
          extraSubtitle={<Skeleton width={100} height={18} />}
          after={
            <label>
              <Skeleton width={40} height={18} />{' '}
              <Skeleton width={17} height={18} />
            </label>
          }
          actions={<Skeleton width={157} height={30} />}
        >
          <Skeleton width={131} height={20} />
        </RichCell>
      ) : (
        <RichCell
          before={<Avatar size={48} src={avatar ? getUrlPath(avatar) : winxAva} />}
          extraSubtitle='Вы великолепны 😉'
          after={
            <Tooltip description='Алмазы — это то, что вы получаете за активность в приложении'>
              <label>
                {balanceFormatter(balance)}{' '}
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
          {username}{' '}
        </RichCell>
      )}
    </Group>
  )
}
