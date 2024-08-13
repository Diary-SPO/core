import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import { ModalRoot as VKUIModalRoot } from '@vkontakte/vkui'

import { MODAL_PAGE_LESSON, MODAL_PAGE_MARK } from '../../../../shared/config'

import LessonModal from './modals/LessonModal'
import MarkDetailedModal from './modals/MarkDetailedModal'

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
    </VKUIModalRoot>
  )
}

export default ModalRoot
