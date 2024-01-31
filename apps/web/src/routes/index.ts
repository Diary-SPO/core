import {
  RouteWithoutRoot,
  createHashRouter
} from '@vkontakte/vk-mini-apps-router'

export const VIEW_SCHEDULE = 'schedule'
export const VIEW_CONTACTS = 'contacts'
export const VIEW_MARKS = 'marks'
export const VIEW_SETTINGS = 'settings'
export const VIEW_ATTESTATION = 'attestation'
export const VIEW_NOTIFICATIONS = 'notifications'

export const MAIN_SETTINGS = 'login'

export const PAGE_MAIN = '/'
export const PAGE_SCHEDULE = `/${VIEW_SCHEDULE}`
export const PAGE_CONTACTS = `/${VIEW_CONTACTS}`
export const PAGE_MARKS = `/${VIEW_MARKS}`
export const PAGE_SETTINGS = `/${VIEW_SETTINGS}`
export const PAGE_ATTESTATION = `/${VIEW_ATTESTATION}`
export const PAGE_NOTIFICATIONS = `/${VIEW_NOTIFICATIONS}`

const routes: RouteWithoutRoot[] = [
  {
    path: PAGE_MAIN,
    panel: MAIN_SETTINGS,
    view: VIEW_SCHEDULE
  },
  {
    path: PAGE_SCHEDULE,
    panel: VIEW_SCHEDULE,
    view: VIEW_SCHEDULE
  },
  {
    path: PAGE_CONTACTS,
    panel: VIEW_CONTACTS,
    view: VIEW_SCHEDULE
  },
  {
    path: PAGE_MARKS,
    panel: VIEW_MARKS,
    view: VIEW_SCHEDULE
  },
  {
    path: PAGE_SETTINGS,
    panel: VIEW_SETTINGS,
    view: VIEW_SCHEDULE
  },
  {
    path: PAGE_ATTESTATION,
    panel: VIEW_ATTESTATION,
    view: VIEW_SCHEDULE
  },
  {
    path: PAGE_NOTIFICATIONS,
    panel: VIEW_NOTIFICATIONS,
    view: VIEW_SCHEDULE
  }
]

export const router = createHashRouter(routes)
