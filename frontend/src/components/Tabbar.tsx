import { FC } from 'react';
import { Tabbar as VKUITabbar, TabbarItem, useAdaptivityConditionalRender } from '@vkontakte/vkui';

import {
  Icon28BookSpreadOutline,
  Icon28MailOutline,
  Icon28GraphOutline,
  Icon28SettingsOutline,
} from '@vkontakte/icons';

import {
  VIEW_CONTACTS, VIEW_SCHEDULE, VIEW_MARKS, VIEW_SETTINGS,
} from '../routes';
import { Pages } from '../types';

interface ITabbar {
  onStoryChange: (current: Pages) => void;
  activeView: Pages;
}

const Tabbar: FC<ITabbar> = ({ onStoryChange, activeView }) => {
  const { viewWidth } = useAdaptivityConditionalRender();

  return (
    viewWidth.tabletMinus && (
      <VKUITabbar className={viewWidth.tabletMinus.className}>
        <TabbarItem
          onClick={() => onStoryChange(VIEW_SCHEDULE)}
          selected={activeView === VIEW_SCHEDULE}
          data-story={VIEW_SCHEDULE}
          text='Расписание'
        >
          <Icon28BookSpreadOutline />
        </TabbarItem>
        <TabbarItem
          onClick={() => onStoryChange(VIEW_MARKS)}
          selected={activeView === VIEW_MARKS}
          data-story={VIEW_MARKS}
          text='Оценки'
        >
          <Icon28GraphOutline />
        </TabbarItem>
        <TabbarItem
          onClick={() => onStoryChange(VIEW_CONTACTS)}
          selected={activeView === VIEW_CONTACTS}
          data-story={VIEW_CONTACTS}
          text='Контакты'
        >
          <Icon28MailOutline />
        </TabbarItem>
        <TabbarItem
          onClick={() => onStoryChange(VIEW_SETTINGS)}
          selected={activeView === VIEW_SETTINGS}
          data-story={VIEW_SETTINGS}
          text='Настройки'
        >
          <Icon28SettingsOutline />
        </TabbarItem>
      </VKUITabbar>
    )
  );
};

export default Tabbar;
