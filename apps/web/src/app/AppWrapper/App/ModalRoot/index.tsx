import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import { ModalRoot as VKUIModalRoot } from '@vkontakte/vkui'

import {
  MODAL_PAGE_LESSON,
  MODAL_PAGE_MARK,
  MODAL_PAGE_REGION
} from '../../../../shared/config'

import LessonModal from './modals/LessonModal'
import MarkDetailedModal from './modals/MarkDetailedModal'
import RegionModal from './modals/RegionModal'

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
      <RegionModal id={MODAL_PAGE_REGION} />
    </VKUIModalRoot>
  )
}

export default ModalRoot
