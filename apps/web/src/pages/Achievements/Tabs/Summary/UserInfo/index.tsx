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
import { type FC, useEffect, useState } from 'react'

import { winxAva } from '../../../../../shared/config/images.ts'

import './index.css'

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
        <Avatar size={96} src={winxAva} />
        <Title className='userInfo__Title' level='2' weight='2' Component='h2'>
          {userData.name}
        </Title>
        <Text className='userInfo__Text'>Студент ({userData.group})</Text>
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
