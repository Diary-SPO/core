import { Icon20AddCircleFillGreen } from '@vkontakte/icons'
import { Avatar, Flex, Group, Header, Panel, View } from '@vkontakte/vkui'
import { type FC, useState } from 'react'
import { PanelHeaderWithBack } from '../../shared'
import type { Props } from '../types.ts'
import Filters from './components/filters.tsx'
import FiltersModal from './components/filtersModal.tsx'
import MarketHeader from './components/marketHeader.tsx'

const urls = [
  'https://mangabuff.ru/img/avatars/x150/806.gif',
  'https://mangabuff.ru/img/avatars/x150/1209.gif',
  'https://mangabuff.ru/img/avatars/x150/689.jpg',
  'https://mangabuff.ru/img/avatars/x150/688.jpg',
  'https://mangabuff.ru/img/avatars/x150/685.gif',
  'https://mangabuff.ru/img/avatars/x150/682.jpg',
  'https://mangabuff.ru/img/avatars/x150/476.jpg',
  'https://mangabuff.ru/img/avatars/x150/477.jpg',
  'https://mangabuff.ru/img/avatars/x150/478.jpg',
  'https://mangabuff.ru/img/avatars/x150/479.jpg',
  'https://mangabuff.ru/img/avatars/x150/480.jpg',
  'https://mangabuff.ru/img/avatars/x150/482.jpg',
  'https://mangabuff.ru/img/avatars/x150/483.jpg',
  'https://mangabuff.ru/img/avatars/x150/484.jpg',
  'https://mangabuff.ru/img/avatars/x150/485.jpg',
  'https://mangabuff.ru/img/avatars/x150/652.jpg'
]

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

  return (
    <View activePanel={activePanel}>
      <Panel id='market'>
        <PanelHeaderWithBack title='Магазин' />
        <MarketHeader />
        <Filters openModal={openMarketFiltersModal} />
        <Group header={<Header mode='secondary'>Полка аватарок</Header>}>
          <Flex margin='auto' gap='2xl' justify='center'>
            {urls.map((url, index) => (
              <Avatar key={index} size={110} src={url}>
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
