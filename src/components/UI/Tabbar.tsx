import { TabbarItem, Tabbar as VKUITabbar, useAdaptivityConditionalRender } from '@vkontakte/vkui';
import {
  Icon28EducationOutline,
  Icon28GraphOutline,
  Icon28HelpOutline,
  Icon28HomeOutline,
  Icon28SettingsOutline,
  Icon28BookSpreadOutline,
} from '@vkontakte/icons';
import { FC } from 'preact/compat';
import {
  VIEW_ATTESTATION, VIEW_CONTACTS, VIEW_MARKS, VIEW_NOTIFICATIONS, VIEW_SCHEDULE, VIEW_SETTINGS,
} from '../../routes';
import { Pages } from '../../types';

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
          text='Главная'
        >
          <Icon28HomeOutline />
        </TabbarItem>
        <TabbarItem
          onClick={() => onStoryChange(VIEW_MARKS)}
          selected={activeView === VIEW_MARKS}
          data-story={VIEW_MARKS}
          text='Успеваемость'
        >
          <Icon28GraphOutline />
        </TabbarItem>
        <TabbarItem
          onClick={() => onStoryChange(VIEW_ATTESTATION)}
          selected={activeView === VIEW_ATTESTATION}
          data-story={VIEW_ATTESTATION}
          text='Аттестация'
        >
          <Icon28EducationOutline />
        </TabbarItem>
        <TabbarItem
          onClick={() => onStoryChange(VIEW_NOTIFICATIONS)}
          selected={activeView === VIEW_NOTIFICATIONS}
          data-story={VIEW_NOTIFICATIONS}
          text='Объявления'
        >
          <Icon28BookSpreadOutline />
        </TabbarItem>
        <TabbarItem
          onClick={() => onStoryChange(VIEW_CONTACTS)}
          selected={activeView === VIEW_CONTACTS}
          data-story={VIEW_CONTACTS}
          text='Помощь'
        >
          <Icon28HelpOutline />
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
