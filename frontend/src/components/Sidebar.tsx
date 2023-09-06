import { FC } from 'react';
import {
  Cell, Group, Panel,
} from '@vkontakte/vkui';
import {
  Icon28GraphOutline,
  Icon28SettingsOutline,
  Icon28BookSpreadOutline,
  Icon28HelpOutline,
} from '@vkontakte/icons';

import {
  VIEW_CONTACTS, VIEW_SCHEDULE, VIEW_MARKS, VIEW_SETTINGS,
} from '../routes';
import { Pages } from '../types';

interface ISidebarProps {
  activeView: Pages;
  onStoryChange: (current: Pages) => void;
}

const activeStoryStyles = {
  backgroundColor: 'var(--vkui--color_background_secondary)',
  borderRadius: 8,
};

const Sidebar: FC<ISidebarProps> = ({ activeView, onStoryChange }) => (
  <Panel>
    <Group>
      <Cell
        disabled={activeView === VIEW_SCHEDULE}
        onClick={() => onStoryChange(VIEW_SCHEDULE)}
        style={activeView === VIEW_SCHEDULE ? activeStoryStyles : undefined}
        before={<Icon28BookSpreadOutline />}
      >
        Расписание
      </Cell>
      <Cell
        disabled={activeView === VIEW_MARKS}
        data-story={VIEW_MARKS}
        onClick={() => onStoryChange(VIEW_MARKS)}
        style={activeView === VIEW_MARKS ? activeStoryStyles : undefined}
        before={<Icon28GraphOutline />}
      >
        Успеваемость
      </Cell>
      <Cell
        disabled={activeView === VIEW_CONTACTS}
        data-story={VIEW_CONTACTS}
        onClick={() => onStoryChange(VIEW_CONTACTS)}
        style={activeView === VIEW_CONTACTS ? activeStoryStyles : undefined}
        before={<Icon28HelpOutline />}
      >
        Помощь
      </Cell>
      <Cell
        disabled={activeView === VIEW_SETTINGS}
        data-story={VIEW_SETTINGS}
        onClick={() => onStoryChange(VIEW_SETTINGS)}
        style={activeView === VIEW_SETTINGS ? activeStoryStyles : undefined}
        before={<Icon28SettingsOutline />}
      >
        Настройки сайта
      </Cell>
    </Group>
  </Panel>
);

export default Sidebar;
