import {
  ModalRoot as VKUIModalRoot,
} from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

import LessonModal from './LessonModal';
import CollegeModal from './CollegeModal';

export const MODAL_PAGE_LESSON = 'lesson';
export const MODAL_COLLEGE_INFO = 'college';

const ModalRoot = () => {
  const routeNavigator = useRouteNavigator();
  const { modal: activeModal } = useActiveVkuiLocation();

  return (
    <VKUIModalRoot activeModal={activeModal} onClose={() => routeNavigator.hideModal()}>
      <LessonModal id={MODAL_PAGE_LESSON} />
      <CollegeModal id={MODAL_COLLEGE_INFO} />
    </VKUIModalRoot>
  );
};

export default ModalRoot;
