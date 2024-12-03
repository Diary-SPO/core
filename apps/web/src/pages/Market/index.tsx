import { Icon20AddCircleFillGreen } from '@vkontakte/icons'
import { Avatar, Flex, Group, Header, Panel, View } from '@vkontakte/vkui'
import { type FC, useState } from 'react'
import { PanelHeaderWithBack } from '../../shared'
import type { Props } from '../types.ts'
import Filters from './components/filters.tsx'
import FiltersModal from './components/filtersModal.tsx'
import MarketHeader from './components/marketHeader.tsx'

const url = 'https://mangabuff.ru/img/avatars/x150'

const data = {
  avatars: [
    {
      isAnimated: true,
      filename: '806.gif',
      tags: ['Девушка'],
      price: 0
    },
    {
      isAnimated: true,
      filename: '1209.gif',
      tags: ['Парень'],
      price: 0
    },
    {
      isAnimated: false,
      filename: '689.jpg',
      tags: ['Девушка'],
      price: 0
    },
    {
      isAnimated: false,
      filename: '688.jpg',
      tags: ['Девушка'],
      price: 0
    }
  ]
}

const Market: FC<Props> = () => {
  const [activePanel, setActivePanel] = useState('market')

  // ФИЛЬТРЫ
  const [filtersModalOpened, setFiltersModalOpened] = useState(false)
  const openMarketFiltersModal = () => {
    setFiltersModalOpened(true)
  }

  const closeMarketFiltersModal = () => {
    setFiltersModalOpened(false)
  }

  const getUrlPath = (avatarData) => {
    return `${url}/${avatarData.filename}`
  }

  return (
    <View activePanel={activePanel}>
      <Panel id='market'>
        <PanelHeaderWithBack title='Магазин' />
        <MarketHeader />
        <Filters openModal={openMarketFiltersModal} />
        <Group header={<Header>Полка аватарок</Header>}>
          <Flex margin='auto' gap='2xl' justify='center'>
            {data.avatars.map((avatarData, index) => (
              <Avatar key={index} size={110} src={getUrlPath(avatarData)}>
                <Avatar.Badge className='select-avatar_badge'>
                  <Icon20AddCircleFillGreen height={25} width={25} />
                </Avatar.Badge>
              </Avatar>
            ))}
          </Flex>
        </Group>
        <FiltersModal
          filtersModalOpened={filtersModalOpened}
          MODAL_NAME='filters'
          closeModal={closeMarketFiltersModal}
        />
      </Panel>
    </View>
  )
}

export default Market
