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

import { winxAva } from '../../../shared/config/images.ts'

import './index.css'

interface UserData {
  city: string
  group: string
  name: string
  org: string
}

const emptyUser: UserData = {
  name: '',
  org: '',
  city: '',
  group: ''
}

const ProfileHeader: FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<UserData>(emptyUser)

  useEffect(() => {
    try {
      const localData = localStorage.getItem('data')
      if (localData) {
        const parsed = JSON.parse(localData) as UserData
        setUserData({
          name: parsed.name || '',
          org: parsed.org || '',
          city: parsed.city || '',
          group: parsed.group || ''
        })
      }
    } catch {
      setUserData(emptyUser)
    } finally {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <Div>
        <Spinner />
      </Div>
    )
  }

  return (
    <Group mode='plain'>
      <Gradient mode='tint' className='profileHeader__Wrapper'>
        <Avatar size={96} src={winxAva} />
        <Title
          className='profileHeader__Title'
          level='2'
          weight='2'
          Component='h2'
        >
          {userData.name || 'Студент'}
        </Title>
        <Text className='profileHeader__Text'>
          {userData.group ? `Студент (${userData.group})` : 'Студент'}
        </Text>
      </Gradient>
      {(userData.org || userData.city) && (
        <Group
          mode='plain'
          header={<Header size='s'>Учебное заведение</Header>}
        >
          <SimpleCell
            multiline
            before={<Icon28SchoolOutline />}
            subtitle={userData.city || undefined}
          >
            {userData.org || userData.city}
          </SimpleCell>
        </Group>
      )}
    </Group>
  )
}

export default ProfileHeader
