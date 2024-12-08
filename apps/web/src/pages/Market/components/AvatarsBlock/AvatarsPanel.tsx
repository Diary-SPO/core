import type { AvatarData } from '@diary-spo/shared'
import {
  Icon16DiamondOutline,
  Icon16Gift,
  Icon20DownloadCloudOutline,
  Icon20DownloadOutline,
  Icon56TagOutline
} from '@vkontakte/icons'
import {
  Avatar,
  Button,
  Flex,
  Group,
  Header,
  Placeholder,
  Skeleton,
  ToolButton,
  Tooltip
} from '@vkontakte/vkui'
import React, { type FC, useState } from 'react'
import {getUrlPath} from "./getUrlPath.tsx";
import {balanceFormatter} from "../HeaderBlock/balanceFormatter.tsx";

interface Props {
  avatars: AvatarData[]
  isStatic: boolean
  isAnimated: boolean
  isLoading: boolean
  isForceLoading: boolean
  selectedTags: string[]
  getShowsAvatars: number
  setShowsAvatars: (showsAvatars: number) => void
  onClickAvatarHandler: (avatar: AvatarData) => void
  getUserBalance: number
  offset: number
}
import './index.css'

export const AvatarsPanel: FC<Props> = ({
  avatars,
  isStatic,
  isAnimated,
  selectedTags,
  isLoading,
  isForceLoading,
  getShowsAvatars,
  setShowsAvatars,
  onClickAvatarHandler,
  getUserBalance,
  offset
}) => {
  const [isNotZeroElements, setIsNotZeroElements] = useState(true)

  const filteredAvatars = (isFull = false) => {
    const filtered = avatars.filter((avatar) => {
      const isType =
        (!isAnimated && !isStatic) ||
        (avatar.isAnimated && isAnimated) ||
        (!avatar.isAnimated && isStatic)
      const isTags =
        !selectedTags.length ||
        selectedTags.filter((tag) => avatar.tags.includes(tag)).length ===
          selectedTags.length
      return isType && isTags
    })

    const isNotZero = filtered.length > 0

    if (isNotZeroElements !== isNotZero) setIsNotZeroElements(isNotZero)

    // Проверка avatars.length нужна, чтобы не сетать стэйт во время отрисовки, а то ошибочка вылазит
    if (filtered.length <= offset && avatars.length) setShowsAvatars(offset)

    return isFull ? filtered : filtered.splice(0, getShowsAvatars)
  }
  const getMoreAvatars = () => {
    setShowsAvatars(
      getShowsAvatars + offset <= avatars.length
        ? getShowsAvatars + offset
        : avatars.length
    )
  }

  const colorIcon = ({avatar}: {avatar: AvatarData}) => <Icon16DiamondOutline color={avatar.price > getUserBalance ? 'red' : undefined}/>

  const skeletons = new Array(7).fill(null)
  const AvatarPreviewComponent = ({ avatar }: { avatar: AvatarData }) => {
    return (
      <Avatar onClick={() => onClickAvatarHandler(avatar)} size={110} src={getUrlPath(avatar)} style={{ isolation: 'auto' }}>
        <Avatar.Badge className='select-avatar_badge'>
          <Tooltip
            title={avatar.price ? `${balanceFormatter(avatar.price)} алмазов` : 'Бесплатно'}
          >
            <ToolButton
              IconCompact={avatar.price ? () => colorIcon({avatar}) : Icon16Gift}
              IconRegular={avatar.price ? () => undefined : Icon16Gift}
            >
              {
                avatar.price > 0 &&
                <label
                  className={avatar.price > getUserBalance ? 'no-money' : ''}>{balanceFormatter(avatar.price)}</label>
              }
            </ToolButton>
          </Tooltip>
        </Avatar.Badge>
      </Avatar>
    )
  }

  const MemorizedAvatarPreview = React.memo(AvatarPreviewComponent)

  return (
    <Group
      header={
        <Header>
          {isForceLoading ? (
            <Skeleton width={119} height={20} />
          ) : (
            'Полка аватарок'
          )}
        </Header>
      }
    >
      <Flex margin='auto' gap='2xl' justify='center'>
        {isForceLoading
          ? skeletons.map((_, index) => (
              <Skeleton
                key={index}
                width={110}
                height={110}
                borderRadius={100}
              />
            ))
          : filteredAvatars().map((avatar, index) => (
              <MemorizedAvatarPreview avatar={avatar} key={index} />
            ))}
        {!isNotZeroElements && !isLoading && (
          <Placeholder>
            <Placeholder.Icon>
              <Icon56TagOutline />
            </Placeholder.Icon>
            <Placeholder.Title>Ничего не найдено</Placeholder.Title>
            <Placeholder.Description>
              Нет ни одной аватарки, удовлетворяющей указанным фильтрам
            </Placeholder.Description>
          </Placeholder>
        )}
      </Flex>
      {getShowsAvatars < filteredAvatars(true).length && isNotZeroElements && (
        <Flex justify='center' style={{ marginTop: 35, marginBottom: 35 }}>
          <Button
            appearance='accent'
            onClick={() => getMoreAvatars()}
            disabled={isLoading}
            before={
              isLoading ? (
                <Icon20DownloadOutline />
              ) : (
                <Icon20DownloadCloudOutline />
              )
            }
          >
            {isLoading ? 'Загружаю ...' : 'Загрузить ещё'}
          </Button>
        </Flex>
      )}
    </Group>
  )
}
