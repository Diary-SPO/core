import { Icon24Filter } from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import {
  Counter,
  Group,
  Header,
  SubnavigationBar,
  SubnavigationButton,
  VisuallyHidden
} from '@vkontakte/vkui'
import { MODAL_PAGE_MARKET_FILTERS } from '../../../shared/config'
import { useMarketFiltersModal } from '../../../store/marketFiltersModal'

const filters = () => {
  const { setData } = useMarketFiltersModal()
  const routeNavigator = useRouteNavigator()

  const openMarketFiltersModal = () => {
    setData({
      id: 'filters'
    })

    routeNavigator.showModal(MODAL_PAGE_MARKET_FILTERS)
  }

  return (
    <>
      <Group header={<Header mode='tertiary'>Фильтры</Header>}>
        <SubnavigationBar>
          <SubnavigationButton
            before={<Icon24Filter />}
            selected={true}
            expandable
            after={
              <Counter size='s'>
                <VisuallyHidden>Применено: </VisuallyHidden>
                {0}
              </Counter>
            }
            onClick={openMarketFiltersModal}
          >
            Фильтры
          </SubnavigationButton>
        </SubnavigationBar>
      </Group>
    </>
  )
}

export default filters
