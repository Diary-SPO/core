import type { AvatarData } from '@diary-spo/shared'
import {Panel, Placeholder, PullToRefresh, View} from '@vkontakte/vkui'
import { type FC, useEffect, useState } from 'react'
import {isApiError, PanelHeaderWithBack} from '../../shared'
import { client } from '../../shared/api/client.ts'
import {HeaderPanel, FiltersPanel, AvatarsPanel} from './components'
import {Icon56HourglassErrorBadgeOutline} from "@vkontakte/icons";

type Props = {}
const offset = 15

export const Market: FC<Props> = () => {
  const [activePanel] = useState('market')

  // ФИЛЬТРЫ
  const [isAnimated, setIsAnimated] = useState(true)
  const [isStatic, setIsStatic] = useState(true)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [getAvatars, setGetAvatars] = useState<AvatarData[]>([])
  const [getShowsAvatars, setShowsAvatars] = useState(15)

  // Статусы загрузки аватарок
  const [isGetAvatarsError, setIsGetAvatarsError] = useState(false)
  const [getIsLoading, setIsLoading] = useState(false)
  const [getIsForceLoading, setIsForceLoading] = useState(true)

  const changeIsAnimated = () => {
    setIsAnimated(!isAnimated)
  }

  const changeIsStatic = () => {
    setIsStatic(!isStatic)
  }

  // Стучимся к серверу
  const getAvatarsFromServer = async (isForce = getAvatars.length <= 0): Promise<void> => {
    if (isForce) {
      setGetAvatars([])
      setShowsAvatars(offset)
    }

    setIsLoading(true)
    setIsForceLoading(isForce)
    setIsGetAvatarsError(false)

    try {
      const {data} = await client.marketAvatars.get()
      if (!data) return

      if (isApiError(data)) {
        new Error('Ошибка от api')
      }

      const tagsToSave: string[] = []

      data.forEach((avatar) => {
        avatar.tags.forEach((tag) => {
          if (!tagsToSave.includes(tag)) tagsToSave.push(tag)
        })
      })

      setTags(tagsToSave)
      setGetAvatars(data)
    } catch {
      setIsGetAvatarsError(true)
    } finally {
      setIsLoading(false)
      setIsForceLoading(false)
    }
  }

  useEffect(() => {
    getAvatarsFromServer()
  }, [])

  return (
    <View activePanel={activePanel}>
      <Panel id='market'>
        <PullToRefresh onRefresh={() => getAvatarsFromServer(true)}>
          <PanelHeaderWithBack title='Магазин'/>
          {
            isGetAvatarsError ?
              <Placeholder>
                <Placeholder.Icon>
                  <Icon56HourglassErrorBadgeOutline/>
                </Placeholder.Icon>
                <Placeholder.Title>
                  Ошибка выполнения запроса
                </Placeholder.Title>
                <Placeholder.Description>
                  Возможно, сервер сейчас не может обработать запрос
                </Placeholder.Description>
              </Placeholder>
              :
              <>
                <HeaderPanel
                  isLoading={getIsLoading}
                  isError={isGetAvatarsError}/>
                <FiltersPanel
                  isAnimated={isAnimated}
                  isStatic={isStatic}
                  changeIsAnimated={changeIsAnimated}
                  changeIsStatic={changeIsStatic}
                  avatars={getAvatars}
                  setSelectedTags={setSelectedTags}
                  selectedTags={selectedTags}
                  tags={tags}
                  isLoading={getIsLoading}
                  isError={isGetAvatarsError}
                />
                <AvatarsPanel
                  avatars={getAvatars}
                  isStatic={isStatic}
                  isAnimated={isAnimated}
                  isError={isGetAvatarsError}
                  isLoading={getIsLoading}
                  isForceLoading={getIsForceLoading}
                  selectedTags={selectedTags}
                  getShowsAvatars={getShowsAvatars}
                  setShowsAvatars={setShowsAvatars}
                  offset={offset}
                />
              </>
          }
        </PullToRefresh>
      </Panel>
    </View>
  )
}