import type { AvatarData } from '@diary-spo/shared'
import {
  Icon24PhotosStackOutline,
  Icon24VideoCircleOutline
} from '@vkontakte/icons'
import {
  Counter,
  Group,
  Header,
  Separator,
  Skeleton,
  SubnavigationBar,
  SubnavigationButton,
  VisuallyHidden
} from '@vkontakte/vkui'
import type { FC } from 'react'

interface Props {
  avatars: AvatarData[]
  isAnimated: boolean
  isStatic: boolean
  changeIsAnimated: () => void
  changeIsStatic: () => void
  setSelectedTags: (tags: string[]) => void
  selectedTags: string[]
  tags: string[]
  isLoading: boolean
  isError: boolean
}

export const FiltersPanel: FC<Props> = ({
  avatars,
  isAnimated,
  isStatic,
  changeIsAnimated,
  changeIsStatic,
  setSelectedTags,
  selectedTags,
  tags,
  isLoading,
  isError
}) => {
  const changeSelectTag = (tag: string) => {
    const indexInSelected = selectedTags.indexOf(tag)

    const selectedTagsCopy = selectedTags.slice(0)

    if (indexInSelected > -1) selectedTagsCopy.splice(indexInSelected, 1)
    else selectedTagsCopy.push(tag)

    setSelectedTags(selectedTagsCopy)

    console.log(selectedTags)
  }

  return (
    <Group
      header={
        <Header>
          {isLoading ? <Skeleton width={67} height={20} /> : 'Фильтры'}
        </Header>
      }
    >
      {isLoading ? (
        <SubnavigationBar>
          <Skeleton width={189} height={36} />
          <Skeleton width={150} height={36} />
        </SubnavigationBar>
      ) : (
        <SubnavigationBar>
          <SubnavigationButton
            before={<Icon24VideoCircleOutline />}
            selected={isAnimated}
            onClick={changeIsAnimated}
            mode='primary'
            after={
              <Counter size='s'>
                <VisuallyHidden>Применено: </VisuallyHidden>
                {avatars.filter((avatar) => avatar.isAnimated).length}
              </Counter>
            }
          >
            Анимированные
          </SubnavigationButton>

          <SubnavigationButton
            before={<Icon24PhotosStackOutline />}
            selected={isStatic}
            onClick={changeIsStatic}
            mode='primary'
            after={
              <Counter size='s'>
                <VisuallyHidden>Применено: </VisuallyHidden>
                {avatars.filter((avatar) => !avatar.isAnimated).length}
              </Counter>
            }
          >
            Статичные
          </SubnavigationButton>

          {Boolean(tags.length) && <Separator direction='vertical' />}

          {tags.map((tag) => (
            <SubnavigationButton
              key={tag}
              onClick={() => changeSelectTag(tag)}
              selected={selectedTags.includes(tag)}
              mode='primary'
              after={
                <Counter size='s'>
                  <VisuallyHidden>Применено: </VisuallyHidden>
                  {avatars.filter((avatar) => avatar.tags.includes(tag)).length}
                </Counter>
              }
            >
              {tag}
            </SubnavigationButton>
          ))}
        </SubnavigationBar>
      )}
    </Group>
  )
}
