import {
  Avatar,
  Flex,
  Group,
  Header,
  ModalPage,
  ModalPageHeader, Placeholder, Skeleton,
  Text
} from '@vkontakte/vkui'
import './index.css'
import {
  Icon16DoneCircle, Icon16SyncCircleFillBlack,
  Icon28ShoppingCartOutline, Icon56HourglassErrorBadgeOutline
} from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import {useState} from 'react'
import { PAGE_MARKET } from '../../../../../routes'
import {AvatarData} from "@diary-spo/shared";
import {getUrlPath} from "../../../../../../pages/Market/components/AvatarsBlock/getUrlPath.tsx";
import {winxAva} from "../../../../../../shared/config/images.ts";
import {client} from "../../../../../../shared/api/client.ts";
import {isApiError} from "../../../../../../shared";
import {useUserEditModal} from "../../../../../../store/userEditModal";
import {PreviewAvatarLoading} from "./PreviewAvatarLoading.tsx";

const defaultCollection: AvatarData[] = [
  {
    id: -1,
    filename: winxAva,
    price: 0,
    isAnimated: false,
    tags: ['стандартная']
  }
]

const UserEditModal = ({ id }: { id: string }) => {
  const { modalData } = useUserEditModal()
  const [selectAva, setSelectAva] = useState<AvatarData|null>(null)
  const navigation = useRouteNavigator()

  const [getAvatars, setAvatars] = useState<AvatarData[]>(defaultCollection)

  const openMarket = () => {
    navigation.push(PAGE_MARKET)
  }

  // Работаем с сервером
  const [isAvatarLoading, setIsAvatarLoading] = useState(false)
  const [isErrorLoading, setIsErrorLoading] = useState(false)
  const [isSaveNewAvatarLoading, setIsSaveNewAvatarLoading] = useState(false)

  const loadAvatarsFromServer = async () => {
    setIsAvatarLoading(true)
    setIsErrorLoading(false)
    try {
      const { data } = await client.userAvatars.get()

      if (data === null || isApiError(data))
        throw new Error('Ошибка с сервера')

      const activeAvatar = data.find((avatar) => avatar.isActive)
      if (activeAvatar)
        setSelectAva(activeAvatar)

      setAvatars([...defaultCollection, ...data])
    } catch {
      setIsErrorLoading(true)
    } finally {
      setIsAvatarLoading(false)
    }
  }

  const selectNewAvatar = async (avatar: AvatarData) => {
    const currentSelectAva = selectAva
    setIsSaveNewAvatarLoading(true)
    setSelectAva(avatar)

    try {
      const response = await client.userSaveAvatar.post({avatarId: avatar.id})

      if (response.status != 200)
        throw new Error('Ошибка с сервера')

      modalData.setAvatarFilename(avatar.filename === winxAva ? null : avatar.filename)
    } catch {
      setSelectAva(currentSelectAva)
    } finally {
      setIsSaveNewAvatarLoading(false)
    }
  }

  const skeletons = new Array(7).fill(null)

  return (
    <ModalPage id={id}
               size={500}
               dynamicContentHeight
               onClosed={() => {
                 setIsAvatarLoading(true)
                 setIsErrorLoading(false)
                 setAvatars(defaultCollection)
               }}
               onOpened={() => {
                 setSelectAva(defaultCollection[0])
                 loadAvatarsFromServer()
               }}
    >
      <ModalPageHeader>Сменить аву</ModalPageHeader>
      {
        isErrorLoading ?
          <Placeholder>
            <Placeholder.Icon>
              <Icon56HourglassErrorBadgeOutline/>
            </Placeholder.Icon>
            <Placeholder.Title>Ошибка выполнения запроса</Placeholder.Title>
            <Placeholder.Description>
              Возможно, сервер сейчас не может обработать запрос
            </Placeholder.Description>
          </Placeholder>
          :
          <Group>
            <Group header={<Header>Мои аватарки</Header>}>
              <Flex margin='auto' gap='2xl' justify='center'>
                {
                  isAvatarLoading
                    ?
                    skeletons.map((_, index) => (
                      <Skeleton
                        key={index}
                        width={110}
                        height={110}
                        borderRadius={100}
                      />
                    ))
                    : getAvatars.map((avatar, index) => (
                      <PreviewAvatarLoading key={index}
                                            selectAva={selectAva}
                                            selectNewAvatar={selectNewAvatar}
                                            isSaveNewAvatarLoading={isSaveNewAvatarLoading}
                                            avatar={avatar}
                      />
                    ))}
                {
                  !isAvatarLoading &&
                  <Avatar size={110} onClick={openMarket}>
                    <Flex direction='column' align='center'>
                      <Icon28ShoppingCartOutline height={50} width={50}/>
                      <Text>Купить ещё</Text>
                    </Flex>
                  </Avatar>
                }
              </Flex>
            </Group>
          </Group>
      }
    </ModalPage>
  )
}

export default UserEditModal
