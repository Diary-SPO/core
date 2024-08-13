import { Icon28SchoolOutline } from '@vkontakte/icons'
import {
  Avatar,
  Div,
  Gradient,
  Group,
  Header,
  SimpleCell,
  Spinner,
  Text,
  Title
} from '@vkontakte/vkui'
<<<<<<<< HEAD:apps/web/src/views/Achievements/UserInfo/index.tsx
import { FunctionComponent } from 'preact'
import { useEffect, useState } from 'preact/compat'
import { winxAva } from '../../../images/config.ts'
========
import type { FunctionComponent } from 'preact'
import { useEffect, useState } from 'preact/compat'
import { winxAva } from '../../../../../config/images.ts'
>>>>>>>> origin/main:apps/web/src/views/Achievements/Tabs/Summary/UserInfo/index.tsx

import './index.css'

interface UserData {
  city: string
  group: string
  name: string
  org: string
}

const UserInfo: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [userData, setUserData] = useState<UserData>({
    name: '',
    org: '',
    city: '',
    group: ''
  })

  const getUserInfo = async () => {
    setIsLoading(true)

<<<<<<<< HEAD:apps/web/src/views/Achievements/UserInfo/index.tsx
    const localData =
      localStorage.getItem('data') ?? sessionStorage.getItem('data')
    console.log('localData', localData)
=========
    const localData = localStorage.getItem('data')
>>>>>>>> origin/main:apps/web/src/views/Achievements/Tabs/Summary/UserInfo/index.tsx
    if (localData) {
      const parsedData = JSON.parse(localData) as UserData

      if (!parsedData.name && !parsedData.group) {
        return
      }

      setUserData(parsedData)
      setIsLoading(false)
    }

    const newUserData =
      localStorage.getItem('data') ?? sessionStorage.getItem('data')
    const parsedUserData = JSON.parse(newUserData) as UserData
    console.log('parsedUserData', parsedUserData)

    setUserData({
      name: parsedUserData.name || '',
      org: parsedUserData.org || '',
      city: parsedUserData.city || '',
      group: parsedUserData.group || ''
    })

    localStorage.setItem('userData', JSON.stringify(newUserData))
    sessionStorage.setItem('userData', JSON.stringify(newUserData))

    setIsLoading(false)
  }

  useEffect(() => {
    getUserInfo()
  }, [])

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
        {/*// @ts-ignore типы не совместимы*/}
        <Avatar size={96} src={winxAva} />
        {/*//@ts-ignore типы React не совсем совместимы с Preact*/}
        <Title className='userInfo__Title' level='2' weight='2' Component='h2'>
          {userData.name}
        </Title>
        {/*//@ts-ignore типы React не совсем совместимы с Preact*/}
        <Text className='userInfo__Text'>Студент ({userData.group})</Text>
      </Gradient>
      <Group
        mode='plain'
        header={<Header mode='tertiary'>Учебное заведение</Header>}
      >
        {/*// @ts-ignore Типы не совместимы */}
        <SimpleCell before={<Icon28SchoolOutline />} subtitle={userData.city}>
          {userData.org}
        </SimpleCell>
      </Group>
    </Group>
  )
}

export default UserInfo
