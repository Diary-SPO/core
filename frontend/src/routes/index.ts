import { createHashRouter, RouteWithoutRoot } from '@vkontakte/vk-mini-apps-router';

export const PAGE_MAIN = '/';
export const PAGE_SCHEDULE = '/schedule';
export const PAGE_CONTACTS = '/contacts';
export const PAGE_PROJECTS = '/projects';
export const PAGE_SETTINGS = '/settings';

export const VIEW_SCHEDULE = 'schedule';
export const VIEW_CONTACTS = 'contacts';
export const VIEW_PROJECTS = 'projects';
export const VIEW_SETTINGS = 'settings';

export const MAIN_SETTINGS = 'login';

const routes: RouteWithoutRoot[] = [
  {
    path: PAGE_MAIN,
    panel: MAIN_SETTINGS,
    view: MAIN_SETTINGS,
  },
  {
    path: PAGE_SCHEDULE,
    panel: VIEW_SCHEDULE,
    view: VIEW_SCHEDULE,
  },
  {
    path: PAGE_CONTACTS,
    panel: VIEW_CONTACTS,
    view: VIEW_CONTACTS,
  },
  {
    path: PAGE_PROJECTS,
    panel: VIEW_PROJECTS,
    view: VIEW_PROJECTS,
  },
  {
    path: PAGE_SETTINGS,
    panel: VIEW_SETTINGS,
    view: VIEW_SETTINGS,
  },
];

export const router = createHashRouter(routes);
