import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import { ModalRoot as VKUIModalRoot } from '@vkontakte/vkui'

import {
  MODAL_PAGE_APP_UPDATE,
  MODAL_PAGE_LESSON,
  MODAL_PAGE_LOGIN_DIAGNOSTICS,
  MODAL_PAGE_MARK,
  MODAL_PAGE_RECOMMEND_APP,
  MODAL_PAGE_REGION,
  MODAL_PAGE_STORAGE_INSPECT,
  MODAL_PAGE_WEEK_PICKER
} from '../../../../shared/config'
import { postponeRecommendationPrompt } from '../../../../shared/utils/recommendationPrompt'

import AppUpdateModal from './modals/AppUpdateModal'
import LessonModal from './modals/LessonModal'
import LoginDiagnosticsModal from './modals/LoginDiagnosticsModal'
import MarkDetailedModal from './modals/MarkDetailedModal'
import RecommendAppModal from './modals/RecommendAppModal'
import RegionModal from './modals/RegionModal'
import StorageInspectModal from './modals/StorageInspectModal'
import WeekPickerModal from './modals/WeekPickerModal'

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
      <AppUpdateModal id={MODAL_PAGE_APP_UPDATE} />
      <LoginDiagnosticsModal id={MODAL_PAGE_LOGIN_DIAGNOSTICS} />
      <StorageInspectModal id={MODAL_PAGE_STORAGE_INSPECT} />
      <WeekPickerModal id={MODAL_PAGE_WEEK_PICKER} />
    </VKUIModalRoot>
  )
}

export default ModalRoot
