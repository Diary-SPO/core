import { useStorageInspect } from '@store'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Group, Header, InfoRow, SimpleCell, Subhead } from '@vkontakte/vkui'
import { type FC, useEffect, useState } from 'react'

import { MODAL_PAGE_STORAGE_INSPECT } from '../../../shared/config'
import type { Storage } from '../../../shared/types'

const TechInfo: FC = () => {
  const routeNavigator = useRouteNavigator()
  const { openStorageInspect } = useStorageInspect()
  const [cacheData, setCacheData] = useState<Storage[]>([])

  useEffect(() => {
    const allKeys = Object.keys(localStorage)

    const getCache = allKeys.map((key) => ({
      key,
      value: localStorage.getItem(key) || ''
    }))
    setCacheData(getCache)
  }, [])

  const openItem = async (item: Storage) => {
    openStorageInspect(item.key, item.value)
    await routeNavigator.showModal(MODAL_PAGE_STORAGE_INSPECT)
  }

  return (
    <Group
      header={
        <Header
          size='s'
          after={<Subhead Component='h5'>Хранится в LocalStorage</Subhead>}
        >
          Кеш
        </Header>
      }
    >
      {cacheData.map((item) => (
        <SimpleCell
          key={item.key}
          multiline
          onClick={() => void openItem(item)}
        >
          <InfoRow header={item.key}>{item.value || '—'}</InfoRow>
        </SimpleCell>
      ))}
    </Group>
  )
}

export default TechInfo
