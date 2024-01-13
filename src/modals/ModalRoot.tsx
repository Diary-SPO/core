import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import { ModalRoot as VKUIModalRoot } from '@vkontakte/vkui'
import LessonModal from './LessonModal'
import MarkDetailedModal from './MarkDetailedModal'

export const MODAL_PAGE_LESSON = 'lesson'
export const MODAL_PAGE_MARK = 'mark'

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
