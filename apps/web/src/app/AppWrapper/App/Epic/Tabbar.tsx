import {
  Icon24StorefrontOutline,
  Icon28BookSpreadOutline,
  Icon28GraphOutline,
  Icon28HomeOutline,
  Icon28SettingsOutline
} from '@vkontakte/icons'
import {
  TabbarItem,
  Tabbar as VKUITabbar,
  useAdaptivityConditionalRender
} from '@vkontakte/vkui'
import type { FC } from 'react'

import type { Pages } from '../../../../shared/types.ts'
import {
  VIEW_MARKET,
  VIEW_MARKS,
  VIEW_NOTIFICATIONS,
  VIEW_SCHEDULE,
  VIEW_SETTINGS
} from '../../../routes'

interface ITabbar {
  onStoryChange: (current: Pages) => void
  activeView: Pages
}

const Tabbar: FC<ITabbar> = ({ onStoryChange, activeView }) => {
  const { viewWidth } = useAdaptivityConditionalRender()

  return (
    viewWidth.tabletMinus && (
      <VKUITabbar className={viewWidth.tabletMinus.className}>
        <TabbarItem
          onClick={() => onStoryChange(VIEW_SCHEDULE)}
          selected={activeView === VIEW_SCHEDULE}
          data-story={VIEW_SCHEDULE}
          label='Главная'
        >
          <Icon28HomeOutline />
        </TabbarItem>
        <TabbarItem
          onClick={() => onStoryChange(VIEW_MARKS)}
          selected={activeView === VIEW_MARKS}
          data-story={VIEW_MARKS}
          label='Успеваемость'
        >
          <Icon28GraphOutline />
        </TabbarItem>
        <TabbarItem
          onClick={() => onStoryChange(VIEW_NOTIFICATIONS)}
          selected={activeView === VIEW_NOTIFICATIONS}
          data-story={VIEW_NOTIFICATIONS}
          label='Объявления'
        >
          <Icon28BookSpreadOutline />
        </TabbarItem>
        <TabbarItem
          onClick={() => onStoryChange(VIEW_MARKET)}
          selected={activeView === VIEW_MARKET}
          data-story={VIEW_MARKET}
          label='Магазин'
        >
          <Icon24StorefrontOutline />
        </TabbarItem>
        <TabbarItem
          onClick={() => onStoryChange(VIEW_SETTINGS)}
          selected={activeView === VIEW_SETTINGS}
          data-story={VIEW_SETTINGS}
          label='Настройки'
        >
          <Icon28SettingsOutline />
        </TabbarItem>
      </VKUITabbar>
    )
  )
}

export default Tabbar
