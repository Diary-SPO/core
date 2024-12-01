import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import { ModalRoot as VKUIModalRoot } from '@vkontakte/vkui'

import {
  MODAL_PAGE_LESSON,
  MODAL_PAGE_MARK,
  MODAL_PAGE_MARKET_FILTERS,
  MODAL_PAGE_USER_EDIT
} from '../../../../shared/config'

import LessonModal from './modals/LessonModal'
import MarkDetailedModal from './modals/MarkDetailedModal'
import MarketFiltersModal from './modals/MarketFiltersModal'
import UserEditModal from './modals/UserEditModal'

const ModalRoot = () => {
  const routeNavigator = useRouteNavigator()
  const { modal: activeModal } = useActiveVkuiLocation()

  return (
    <VKUIModalRoot
      activeModal={activeModal}
      onClose={() => routeNavigator.hideModal()}
    >
      <LessonModal id={MODAL_PAGE_LESSON} />
      <MarkDetailedModal id={MODAL_PAGE_MARK} />
      <UserEditModal id={MODAL_PAGE_USER_EDIT} />
      <MarketFiltersModal id={MODAL_PAGE_MARKET_FILTERS} />
    </VKUIModalRoot>
  )
}

export default ModalRoot
