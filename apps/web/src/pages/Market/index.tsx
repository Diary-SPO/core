import type { AvatarData } from '@diary-spo/shared'
import { Icon56HourglassErrorBadgeOutline } from '@vkontakte/icons'
import { Panel, Placeholder, PullToRefresh, View } from '@vkontakte/vkui'
import { type FC, useEffect, useState } from 'react'
import { PanelHeaderWithBack, isApiError } from '../../shared'
import { client } from '../../shared/api/client.ts'
import {AvatarsPanel, FiltersPanel, HeaderPanel} from './components'
import {useBuyModal} from "@store";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {MODAL_PAGE_BUY} from "../../shared/config";

type Props = {}
const offset = 15

export const Market: FC<Props> = () => {
  const [activePanel] = useState('market')
  const routeNavigator = useRouteNavigator()

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

  const getAvatarsFromServer = async () => {
    const { data } = await client.marketAvatars.get()
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
  }

  // Статусы загрузки кошелька
  const [getUserName, setUserName] = useState('')
  const [getUserAvatar, setUserAvatar] = useState<string|null>(null)
  const [getUserBalance, setUserBalance] = useState(0)

  const getUserInfoFromServer = async () => {
    const { data } = await client.userInfo.get()

    if (data === null || isApiError(data)) {
      throw new Error('Ошибка от api')
    }

    setUserName(`${data.firstName} ${data.lastName}`)
    setUserAvatar(data.avatar)
    setUserBalance(data.balance)
  }

  // Стучимся к серверу
  const getDataFromServer = async (
    isForce = getAvatars.length <= 0
  ): Promise<void> => {
    if (isForce) {
      setGetAvatars([])
      setShowsAvatars(offset)
    }

    setIsLoading(true)
    setIsForceLoading(isForce)
    setIsGetAvatarsError(false)

    try {
      await getUserInfoFromServer()
      await getAvatarsFromServer()
    } catch {
      setIsGetAvatarsError(true)
    } finally {
      setIsLoading(false)
      setIsForceLoading(false)
    }
  }

  useEffect(() => {
    getDataFromServer()
  }, [])

  const {setData} = useBuyModal()

  // Покупка
  const onClickAvatarHandler = (avatar: AvatarData) => {
    setData({
      avatar,
      balance: getUserBalance,
      setBalance: setUserBalance
    })
    routeNavigator.showModal(MODAL_PAGE_BUY)
  }

  return (
    <View activePanel={activePanel}>
      <Panel id='market'>
        <PullToRefresh onRefresh={() => getDataFromServer(true)}>
          <PanelHeaderWithBack title='Магазин' />
          {isGetAvatarsError ? (
            <Placeholder>
              <Placeholder.Icon>
                <Icon56HourglassErrorBadgeOutline />
              </Placeholder.Icon>
              <Placeholder.Title>Ошибка выполнения запроса</Placeholder.Title>
              <Placeholder.Description>
                Возможно, сервер сейчас не может обработать запрос
              </Placeholder.Description>
            </Placeholder>
          ) : (
            <>
              <HeaderPanel
                isLoading={getIsLoading}
                username={getUserName}
                avatar={getUserAvatar}
                balance={getUserBalance}
              />
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
                isLoading={getIsLoading}
                isForceLoading={getIsForceLoading}
                selectedTags={selectedTags}
                getShowsAvatars={getShowsAvatars}
                setShowsAvatars={setShowsAvatars}
                onClickAvatarHandler={onClickAvatarHandler}
                getUserBalance={getUserBalance}
                offset={offset}
              />
            </>
          )}
        </PullToRefresh>
      </Panel>
    </View>
  )
}
