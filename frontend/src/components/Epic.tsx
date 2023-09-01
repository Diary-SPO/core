import { FC } from 'react';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';
import { useAdaptivityConditionalRender } from '@vkontakte/vkui';
import { Epic as VKUIEpic } from '@vkontakte/vkui/dist/components/Epic/Epic';
import {
  VIEW_CONTACTS, VIEW_SCHEDULE, VIEW_PROJECTS, VIEW_SETTINGS,
} from '../routes';
import { Pages } from '../types';
import Tabbar from './Tabbar';
import Suspense from './Suspense';
import {
  Contacts, Profile, Projects, Settings,
} from '../views';

interface IEpic {
  onStoryChange: (current: Pages) => void
  toggleAppearance: () => void
}

const Epic: FC<IEpic> = ({ onStoryChange, toggleAppearance }) => {
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
        <Profile id={VIEW_SCHEDULE} />
      </Suspense>
      <Suspense id={VIEW_PROJECTS} mode='screen'>
        <Projects id={VIEW_PROJECTS} />
      </Suspense>
      <Suspense id={VIEW_CONTACTS} mode='screen'>
        <Contacts id={VIEW_CONTACTS} />
      </Suspense>
      <Suspense id={VIEW_SETTINGS} mode='screen'>
        <Settings id={VIEW_SETTINGS} toggleAppearance={toggleAppearance} />
      </Suspense>
    </VKUIEpic>
  );
};

export default Epic;
