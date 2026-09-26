import { useNativeBackButton } from '@native-back-button'
import {
  useActiveVkuiLocation,
  useRouteNavigator
} from '@vkontakte/vk-mini-apps-router'
import { ModalRoot as VKUIModalRoot } from '@vkontakte/vkui'
import { useCallback } from 'react'
import { MODAL_PAGE_LESSON, MODAL_PAGE_MARK } from '../../../../shared/config'

import LessonModal from './modals/LessonModal'
import MarkDetailedModal from './modals/MarkDetailedModal'

const ModalRoot = () => {
  const routeNavigator = useRouteNavigator()
  const { modal: activeModal } = useActiveVkuiLocation()
  const closeModal = useCallback(() => {
    void routeNavigator.hideModal()
  }, [routeNavigator])

  const handleNativeBack = useCallback(() => {
    if (!activeModal) {
      return false
    }

    closeModal()
    return true
  }, [activeModal, closeModal])

  useNativeBackButton(handleNativeBack)

  return (
    <VKUIModalRoot activeModal={activeModal} onClose={closeModal}>
      <LessonModal id={MODAL_PAGE_LESSON} />
      <MarkDetailedModal id={MODAL_PAGE_MARK} />
    </VKUIModalRoot>
  )
}

export default ModalRoot
