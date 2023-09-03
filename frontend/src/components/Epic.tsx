import { FC } from 'react';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';
import { useAdaptivityConditionalRender } from '@vkontakte/vkui';
import { Epic as VKUIEpic } from '@vkontakte/vkui/dist/components/Epic/Epic';
import {
  VIEW_CONTACTS, VIEW_SCHEDULE, VIEW_MARKS, VIEW_SETTINGS, MAIN_SETTINGS,
} from '../routes';
import { Pages } from '../types';

import Tabbar from './Tabbar';
import Suspense from './Suspense';
import {
  Contacts, LoginForm, Schedule, Marks, Settings,
} from '../views';

interface IEpic {
  onStoryChange: (current: Pages) => void
}

const Epic: FC<IEpic> = ({ onStoryChange }) => {
  const {
    view: activeView = 'profile' as Pages,
  } = useActiveVkuiLocation();
  const { viewWidth } = useAdaptivityConditionalRender();

  return (
    <VKUIEpic
      activeStory={activeView}
      tabbar={
        viewWidth.tabletMinus
        && <Tabbar onStoryChange={onStoryChange} activeView={activeView as Pages} />
      }
    >
      <Suspense id={VIEW_SCHEDULE} mode='screen'>
        <Schedule id={VIEW_SCHEDULE} />
      </Suspense>
      <Suspense id={VIEW_MARKS} mode='screen'>
        <Marks id={VIEW_MARKS} />
      </Suspense>
      <Suspense id={VIEW_CONTACTS} mode='screen'>
        <Contacts id={VIEW_CONTACTS} />
      </Suspense>
      <Suspense id={VIEW_SETTINGS} mode='screen'>
        <Settings id={VIEW_SETTINGS} />
      </Suspense>
      <Suspense id={MAIN_SETTINGS} mode='screen'>
        <LoginForm id={MAIN_SETTINGS} />
      </Suspense>
    </VKUIEpic>
  );
};

export default Epic;
