import { Group, Header, InfoRow, SimpleCell, Subhead } from '@vkontakte/vkui'
import { type FC, useEffect, useState } from 'react'

import type { Storage } from '../../../shared/types'

const TechInfo: FC = () => {
  const [cacheData, setCacheData] = useState<Storage[]>([])

  useEffect(() => {
    const allKeys = Object.keys(localStorage)

    const getCache = allKeys.map((key) => ({
      key,
      value: localStorage.getItem(key) || 'false'
    }))
    setCacheData(getCache)
  }, [])

  return (
    <Group
      header={
        <Header
          mode='secondary'
          after={<Subhead Component='h5'>Хранится в LocalStorage</Subhead>}
        >
          Кеш
        </Header>
      }
    >
      {cacheData.map((item) => (
        <SimpleCell key={item.key}>
          <InfoRow header={item.key}>{item.value.slice(0, 30)}</InfoRow>
        </SimpleCell>
      ))}
    </Group>
  )
}

export default TechInfo
