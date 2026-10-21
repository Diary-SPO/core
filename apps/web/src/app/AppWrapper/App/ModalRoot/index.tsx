import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import { ModalRoot as VKUIModalRoot } from '@vkontakte/vkui'

import {
  MODAL_PAGE_LESSON,
  MODAL_PAGE_LOGIN_DIAGNOSTICS,
  MODAL_PAGE_MARK,
  MODAL_PAGE_RECOMMEND_APP,
  MODAL_PAGE_REGION
} from '../../../../shared/config'
import { postponeRecommendationPrompt } from '../../../../shared/utils/recommendationPrompt'

import LessonModal from './modals/LessonModal'
import LoginDiagnosticsModal from './modals/LoginDiagnosticsModal'
import MarkDetailedModal from './modals/MarkDetailedModal'
import RecommendAppModal from './modals/RecommendAppModal'
import RegionModal from './modals/RegionModal'

const ModalRoot = () => {
  const routeNavigator = useRouteNavigator()
  const { modal: activeModal } = useActiveVkuiLocation()

  const closeModal = (modalId: string) => {
    if (modalId === MODAL_PAGE_RECOMMEND_APP) {
      postponeRecommendationPrompt()
    }

    routeNavigator.hideModal()
  }

  return (
    <VKUIModalRoot activeModal={activeModal} onClose={closeModal}>
      <LessonModal id={MODAL_PAGE_LESSON} />
      <MarkDetailedModal id={MODAL_PAGE_MARK} />
      <RegionModal id={MODAL_PAGE_REGION} />
      <RecommendAppModal id={MODAL_PAGE_RECOMMEND_APP} />
      <LoginDiagnosticsModal id={MODAL_PAGE_LOGIN_DIAGNOSTICS} />
    </VKUIModalRoot>
  )
}

export default ModalRoot
