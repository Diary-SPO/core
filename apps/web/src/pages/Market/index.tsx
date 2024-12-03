import type { AvatarData } from '@diary-spo/shared'
import { Panel, View } from '@vkontakte/vkui'
import { type FC, useEffect, useState } from 'react'
import { PanelHeaderWithBack } from '../../shared'
import { client } from '../../shared/api/client.ts'
import AvatarsPanel from './components/avatarsPanel.tsx'
import Filters from './components/filtersPanel.tsx'
import MarketHeader from './components/marketHeader.tsx'

type Props = {}

const Market: FC<Props> = () => {
  const [activePanel] = useState('market')

  // ФИЛЬТРЫ
  const [isAnimated, setIsAnimated] = useState(true)
  const [isStatic, setIsStatic] = useState(true)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [avatars, setAvatars] = useState<AvatarData[]>([])

  const changeIsAnimated = () => {
    setIsAnimated(!isAnimated)
  }

  const changeIsStatic = () => {
    setIsStatic(!isStatic)
  }

  // Стучимся к серверу
  const getAvatarsFromServer = async (): Promise<void> => {
    const avatars = await client.marketAvatars({ page: 1 }).get()

    const data = avatars.data

    if (!data) return

    const tagsToSave: string[] = []

    avatars.data.forEach((avatar) => {
      avatar.tags.forEach((tag) => {
        if (!tagsToSave.includes(tag)) tagsToSave.push(tag)
      })
    })

    setTags(tagsToSave)
    setAvatars(data)
  }

  useEffect(() => {
    getAvatarsFromServer()
  }, [])

  return (
    <View activePanel={activePanel}>
      <Panel id='market'>
        <PanelHeaderWithBack title='Магазин' />
        <MarketHeader />
        <Filters
          isAnimated={isAnimated}
          isStatic={isStatic}
          changeIsAnimated={changeIsAnimated}
          changeIsStatic={changeIsStatic}
          avatars={avatars}
          setSelectedTags={setSelectedTags}
          selectedTags={selectedTags}
          tags={tags}
        />
        <AvatarsPanel
          avatars={avatars}
          isStatic={isStatic}
          isAnimated={isAnimated}
          selectedTags={selectedTags}
        />
      </Panel>
    </View>
  )
}

export default Market
