import {
  RouteWithoutRoot,
  createHashRouter,
} from '@vkontakte/vk-mini-apps-router'

export const PAGE_MAIN = '/'
export const PAGE_SCHEDULE = '/schedule'
export const PAGE_CONTACTS = '/contacts'
export const PAGE_MARKS = '/marks'
export const PAGE_SETTINGS = '/settings'
export const PAGE_ATTESTATION = '/attestation'
export const PAGE_NOTIFICATIONS = '/notifications'

export const VIEW_SCHEDULE = 'schedule'
export const VIEW_CONTACTS = 'contacts'
export const VIEW_MARKS = 'marks'
export const VIEW_SETTINGS = 'settings'

export const MAIN_SETTINGS = 'login'
export const VIEW_ATTESTATION = 'attestation'
export const VIEW_NOTIFICATIONS = 'notifications'

const routes: RouteWithoutRoot[] = [
  {
    path: PAGE_MAIN,
    panel: MAIN_SETTINGS,
    view: VIEW_SCHEDULE,
  },
  {
    path: PAGE_SCHEDULE,
    panel: VIEW_SCHEDULE,
    view: VIEW_SCHEDULE,
  },
  {
    path: PAGE_CONTACTS,
    panel: VIEW_CONTACTS,
    view: VIEW_SCHEDULE,
  },
  {
    path: PAGE_MARKS,
    panel: VIEW_MARKS,
    view: VIEW_SCHEDULE,
  },
  {
    path: PAGE_SETTINGS,
    panel: VIEW_SETTINGS,
    view: VIEW_SCHEDULE,
  },
  {
    path: PAGE_ATTESTATION,
    panel: VIEW_ATTESTATION,
    view: VIEW_SCHEDULE,
  },
  {
    path: PAGE_NOTIFICATIONS,
    panel: VIEW_NOTIFICATIONS,
    view: VIEW_SCHEDULE,
  },
]

export const router = createHashRouter(routes)
