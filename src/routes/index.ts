import { RouteWithoutRoot, createHashRouter } from '@vkontakte/vk-mini-apps-router';

export const PAGE_MAIN = '/';
export const PAGE_SCHEDULE = '/schedule';
export const PAGE_CONTACTS = '/contacts';
export const PAGE_MARKS = '/marks';
export const PAGE_SETTINGS = '/settings';
export const PAGE_ATTESTATION = '/attestation';
export const PAGE_NOTIFICATIONS = '/notifications';

export const VIEW_SCHEDULE = 'schedule';
export const VIEW_CONTACTS = 'contacts';
export const VIEW_MARKS = 'marks';
export const VIEW_SETTINGS = 'settings';

export const MAIN_SETTINGS = 'login';
export const VIEW_ATTESTATION = 'attestation';
export const VIEW_NOTIFICATIONS = 'notifications';

const routes: RouteWithoutRoot[] = [
  {
    path: PAGE_MAIN,
    panel: MAIN_SETTINGS,
    view: MAIN_SETTINGS,
  },
  {
    path: PAGE_SCHEDULE,
    panel: VIEW_SCHEDULE,
    view: MAIN_SETTINGS,
  },
  {
    path: PAGE_CONTACTS,
    panel: VIEW_CONTACTS,
    view: MAIN_SETTINGS,
  },
  {
    path: PAGE_MARKS,
    panel: VIEW_MARKS,
    view: MAIN_SETTINGS,
  },
  {
    path: PAGE_SETTINGS,
    panel: VIEW_SETTINGS,
    view: MAIN_SETTINGS,
  },
  {
    path: PAGE_ATTESTATION,
    panel: VIEW_ATTESTATION,
    view: MAIN_SETTINGS,
  },
  {
    path: PAGE_NOTIFICATIONS,
    panel: VIEW_NOTIFICATIONS,
    view: MAIN_SETTINGS,
  },
];

export const router = createHashRouter(routes);
