import { Group, Header, InfoRow, SimpleCell, Subhead } from '@vkontakte/vkui'
import type { FunctionComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import type { Storage } from '../../../shared/types'

const TechInfo: FunctionComponent = () => {
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
        //@ts-ignore типы React не совсем совместимы с Preact
        <Header
          mode='secondary'
          //@ts-ignore типы React не совсем совместимы с Preact
          aside={
            // @ts-ignore Типы не совместимы */
            <Subhead Component='h5'>Хранится в LocalStorage</Subhead>
          }
        >
          Кеш
        </Header>
      }
    >
      {cacheData.map((item) => (
        /*// @ts-ignore Типы не совместимы */
        <SimpleCell key={item.key}>
          <InfoRow header={item.key}>{item.value.slice(0, 30)}</InfoRow>
        </SimpleCell>
      ))}
    </Group>
  )
}

export default TechInfo
