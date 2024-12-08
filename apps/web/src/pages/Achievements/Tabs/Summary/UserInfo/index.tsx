import { Icon28SchoolOutline } from '@vkontakte/icons'
import {
  Avatar,
  Button,
  Div,
  Gradient,
  Group,
  Header,
  Placeholder,
  SimpleCell,
  Spinner
} from '@vkontakte/vkui'
import { type FC, useEffect, useState } from 'react'

import './index.css'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { MODAL_PAGE_USER_EDIT } from '../../../../../shared/config'
import { useUserEditModal } from '../../../../../store/userEditModal'
import {client} from "../../../../../shared/api/client.ts";
import {isApiError} from "../../../../../shared";
import {getUrlPath} from "../../../../Market/components/AvatarsBlock/getUrlPath.tsx";
import {winxAva} from "../../../../../shared/config/images.ts";

interface UserData {
  city: string
  group: string
  name: string
  org: string
}

const UserInfo: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [userData, setUserData] = useState<UserData>({
    name: '',
    org: '',
    city: '',
    group: ''
  })

  const getUserInfo = async () => {
    setIsLoading(true)

    const localData = localStorage.getItem('data')
    if (localData) {
      const parsedData = JSON.parse(localData) as UserData

      if (!parsedData.name && !parsedData.group) {
        return
      }

      setUserData(parsedData)
      setIsLoading(false)
    }

    const newUserData = localStorage.getItem('data')
    // @TODO: ??
    const parsedUserData = JSON.parse(newUserData) as UserData

    setUserData({
      name: parsedUserData.name || '',
      org: parsedUserData.org || '',
      city: parsedUserData.city || '',
      group: parsedUserData.group || ''
    })

    localStorage.setItem('userData', JSON.stringify(newUserData))

    setIsLoading(false)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: all good
  useEffect(() => {
    getUserInfo()
  }, [])


  const [userInfoIsLoading, setUserInfoIsLoading] = useState(true)
  const [userAvatarFilename, setUserAvatarFilename] = useState<string|null|undefined>(undefined)
  const { setData } = useUserEditModal()
  const routeNavigator = useRouteNavigator()

  const handleEditUserButtonClick = () => {
    setData({
      setAvatarFilename: (value: string) => setUserAvatarFilename(value)
    })
    routeNavigator.showModal(MODAL_PAGE_USER_EDIT)
  }


  const loadUserInfoFromServer = async () => {
    setUserInfoIsLoading(true)

    try {
      const { data } = await client.userInfo.get()

      if (data === null || isApiError(data))
        throw new Error('Ошибка с сервера')

      setUserAvatarFilename(data.avatar)
    } finally {
      setUserInfoIsLoading(false)
    }
  }

  useEffect(() => {
    loadUserInfoFromServer()
  }, []);

  if (isLoading) {
    return (
      <Div>
        <Spinner />
      </Div>
    )
  }

  const header = <Header mode='tertiary'>Личная информация</Header>

  return (
    <Group mode='plain' header={header}>
      <Gradient mode='tint' className='userInfo__Wrapper'>
        <Avatar size={96} src={userAvatarFilename ? getUrlPath(userAvatarFilename) : (userAvatarFilename === null ? winxAva : undefined)} />
        <Placeholder
          title={userData.name}
          className='userInfo__Content'
          action={
            <Button
              size='m'
              mode='secondary'
              onClick={handleEditUserButtonClick}
            >
              Редактировать
            </Button>
          }
        >
          Студент ({userData.group})
        </Placeholder>
      </Gradient>
      <Group
        mode='plain'
        header={<Header mode='tertiary'>Учебное заведение</Header>}
      >
        <SimpleCell before={<Icon28SchoolOutline />} subtitle={userData.city}>
          {userData.org}
        </SimpleCell>
      </Group>
    </Group>
  )
}

export default UserInfo
