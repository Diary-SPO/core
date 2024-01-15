import { Icon16Dropdown, Icon20NewsfeedOutline } from '@vkontakte/icons'
import { HorizontalScroll, Tabs as VKUITabs, TabsItem } from '@vkontakte/vkui'
import { FC } from 'preact/compat'
import { useState } from 'preact/hooks'
import { b } from 'vitest/dist/reporters-trlZlObr'

const Tabs = () => {
  const [selected, setSelected] = useState('news')

  return (
    <VKUITabs
      mode='accent'
      layoutFillMode='auto'
      withScrollToSelectedTab
      scrollBehaviorToSelectedTab='center'
    >
      <HorizontalScroll arrowSize='m'>
        <TabsItem
          selected={selected === 'groups'}
          onClick={() => setSelected('groups')}
        >
          За неделю
        </TabsItem>
        <TabsItem
          before={<Icon20NewsfeedOutline />}
          after={<Icon16Dropdown />}
          selected={selected === 'news'}
          onClick={() => setSelected('news')}
        >
          Другой период
        </TabsItem>
      </HorizontalScroll>
    </VKUITabs>
  )
}

export default Tabs

interface DefaultInPanelProps {
  menuOpened: boolean
  onMenuClick: (b: boolean) => void
  selected: string
  setSelected: (item: string) => void
}

const DefaultInPanel: FC<DefaultInPanelProps> = ({
  menuOpened,
  onMenuClick,
  selected,
  setSelected
}) => {
  return (
    <VKUITabs>
      <TabsItem
        after={
          <Icon16Dropdown
            style={{
              transform: `rotate(${menuOpened ? '180deg' : '0'})`
            }}
          />
        }
        selected={selected === 'news'}
        onClick={() => {
          if (selected === 'news') {
            onMenuClick(false)
          }
          setSelected('news')
        }}
        id='tab-news'
        aria-controls='tab-content-news'
      >
        Новости
      </TabsItem>
      <TabsItem
        selected={selected === 'recommendations'}
        onClick={() => {
          onMenuClick(false)
          setSelected('recommendations')
        }}
        id='tab-recommendations'
        aria-controls='tab-content-recommendations'
      >
        Интересное
      </TabsItem>
    </VKUITabs>
  )
}

export { DefaultInPanel }
