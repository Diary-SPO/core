import {
  ModalRoot as VKUIModalRoot,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

import LessonModal from './LessonModal.tsx';

export const MODAL_PAGE_LESSON = 'lesson';

const ModalRoot = () => {
  const routeNavigator = useRouteNavigator();
  const { modal: activeModal } = useActiveVkuiLocation();

  return (
    <VKUIModalRoot activeModal={activeModal} onClose={() => routeNavigator.hideModal()}>
      <LessonModal id={MODAL_PAGE_LESSON} />
    </VKUIModalRoot>
  );
};

export default ModalRoot;
