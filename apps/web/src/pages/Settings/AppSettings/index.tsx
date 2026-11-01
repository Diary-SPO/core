import {
  Icon28ChevronRightOutline,
  Icon28SearchOutline
} from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Group, Header, Panel, Search, SimpleCell } from '@vkontakte/vkui'
import { type FC, useEffect, useMemo, useState } from 'react'

import { PanelHeaderWithBack } from '../../../shared'
import type { Props } from '../../types.ts'
import {
  filterSettingsCategories,
  filterSettingsItems
} from '../shared/catalog'
import {
  DEVELOPER_MODE_EVENT,
  isDeveloperModeUnlocked
} from '../shared/developer'

const AppSettings: FC<Props> = ({ id }) => {
  const routeNavigator = useRouteNavigator()
  const [query, setQuery] = useState('')
  const [developerUnlocked, setDeveloperUnlocked] = useState(
    isDeveloperModeUnlocked
  )

  useEffect(() => {
    const sync = () => setDeveloperUnlocked(isDeveloperModeUnlocked())
    window.addEventListener(DEVELOPER_MODE_EVENT, sync)
    return () => window.removeEventListener(DEVELOPER_MODE_EVENT, sync)
  }, [])

  const categories = useMemo(
    () => filterSettingsCategories(query),
    [query, developerUnlocked]
  )
  const items = useMemo(
    () => filterSettingsItems(query),
    [query, developerUnlocked]
  )
  const searching = query.trim().length > 0

  return (
    <Panel nav={id}>
      <PanelHeaderWithBack title='Настройки' />
      <Group>
        <Search
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          after={null}
          icon={<Icon28SearchOutline />}
          placeholder='Поиск настроек'
        />
      </Group>

      {searching ? (
        <Group header={<Header size='s'>Результаты</Header>}>
          {items.length === 0 ? (
            <SimpleCell multiline>Ничего не нашлось</SimpleCell>
          ) : (
            items.map((item) => (
              <SimpleCell
                key={item.id}
                multiline
                subtitle={item.subtitle}
                after={<Icon28ChevronRightOutline />}
                onClick={() => void routeNavigator.push(item.path)}
              >
                {item.title}
              </SimpleCell>
            ))
          )}
        </Group>
      ) : (
        <Group header={<Header size='s'>Категории</Header>}>
          {categories.map((category) => (
            <SimpleCell
              key={category.id}
              multiline
              subtitle={category.subtitle}
              after={<Icon28ChevronRightOutline />}
              onClick={() => void routeNavigator.push(category.path)}
            >
              {category.title}
            </SimpleCell>
          ))}
        </Group>
      )}
    </Panel>
  )
}

export default AppSettings
