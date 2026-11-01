import {
  Icon28BookSpreadOutline,
  Icon28GraphOutline,
  Icon28HomeOutline,
  Icon28UserCircleOutline
} from '@vkontakte/icons'
import {
  TabbarItem,
  useAdaptivityConditionalRender,
  Tabbar as VKUITabbar
} from '@vkontakte/vkui'
import { type FC, useEffect, useState } from 'react'
import {
  getTabbarLabelsVisible,
  TABBAR_LABELS_CHANGE_EVENT
} from '../../../../shared/config'
import type { Pages } from '../../../../shared/types.ts'
import {
  isSettingsPanel,
  VIEW_MARKS,
  VIEW_NOTIFICATIONS,
  VIEW_SCHEDULE,
  VIEW_SETTINGS
} from '../../../routes'

interface ITabbar {
  onStoryChange: (current: Pages) => void
  activePanel?: string | null
}

const Tabbar: FC<ITabbar> = ({ onStoryChange, activePanel }) => {
  const { viewWidth } = useAdaptivityConditionalRender()
  const [showLabels, setShowLabels] = useState(getTabbarLabelsVisible)

  useEffect(() => {
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<boolean>).detail
      setShowLabels(
        typeof detail === 'boolean' ? detail : getTabbarLabelsVisible()
      )
    }
    window.addEventListener(TABBAR_LABELS_CHANGE_EVENT, onChange)
    return () =>
      window.removeEventListener(TABBAR_LABELS_CHANGE_EVENT, onChange)
  }, [])

  return (
    viewWidth.tabletMinus && (
      <VKUITabbar className={viewWidth.tabletMinus.className}>
        <TabbarItem
          onClick={() => onStoryChange(VIEW_SCHEDULE)}
          selected={activePanel === VIEW_SCHEDULE}
          data-story={VIEW_SCHEDULE}
          label={showLabels ? 'Главная' : undefined}
        >
          <Icon28HomeOutline />
        </TabbarItem>
        <TabbarItem
          onClick={() => onStoryChange(VIEW_MARKS)}
          selected={activePanel === VIEW_MARKS}
          data-story={VIEW_MARKS}
          label={showLabels ? 'Успеваемость' : undefined}
        >
          <Icon28GraphOutline />
        </TabbarItem>
        <TabbarItem
          onClick={() => onStoryChange(VIEW_NOTIFICATIONS)}
          selected={activePanel === VIEW_NOTIFICATIONS}
          data-story={VIEW_NOTIFICATIONS}
          label={showLabels ? 'Объявления' : undefined}
        >
          <Icon28BookSpreadOutline />
        </TabbarItem>
        <TabbarItem
          onClick={() => onStoryChange(VIEW_SETTINGS)}
          selected={isSettingsPanel(activePanel)}
          data-story={VIEW_SETTINGS}
          label={showLabels ? 'Профиль' : undefined}
        >
          <Icon28UserCircleOutline />
        </TabbarItem>
      </VKUITabbar>
    )
  )
}

export default Tabbar
