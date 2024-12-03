import type { AvatarData } from '@diary-spo/shared'
import {
  Icon16DiamondOutline,
  Icon16Gift,
  Icon56TagOutline
} from '@vkontakte/icons'
import {
  Avatar,
  Flex,
  Group,
  Header,
  Placeholder,
  ToolButton,
  Tooltip
} from '@vkontakte/vkui'
import { type FC, useState } from 'react'
import { API_URL } from '../../../shared/config'

interface Props {
  avatars: AvatarData[]
  isStatic: boolean
  isAnimated: boolean
  selectedTags: string[]
}

const url = `${API_URL}/uploads/avatars/`

const avatarsPanel: FC<Props> = ({
  avatars,
  isStatic,
  isAnimated,
  selectedTags
}) => {
  const [isNotZeroElements, setIsNotZeroElements] = useState(true)

  const getUrlPath = (avatarData: AvatarData) => {
    return `${url}/${avatarData.filename}`
  }

  const filteredAvatars = () => {
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

    return filtered
  }
  return (
    <Group header={<Header>Полка аватарок</Header>}>
      <Flex margin='auto' gap='2xl' justify='center'>
        {filteredAvatars().map((avatar, index) => (
          <Avatar
            key={index}
            size={110}
            src={getUrlPath(avatar)}
            style={{ isolation: 'auto' }}
          >
            <Avatar.Badge className='select-avatar_badge'>
              <Tooltip
                title={avatar.price ? `${avatar.price} алмазов` : 'Бесплатно'}
              >
                <ToolButton
                  IconCompact={avatar.price ? Icon16DiamondOutline : Icon16Gift}
                  IconRegular={avatar.price ? Icon16DiamondOutline : Icon16Gift}
                >
                  {avatar.price || null}
                </ToolButton>
              </Tooltip>
            </Avatar.Badge>
          </Avatar>
        ))}
        {!isNotZeroElements && (
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
    </Group>
  )
}

export default avatarsPanel
