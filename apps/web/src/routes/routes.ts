import { RouteWithoutRoot } from '@vkontakte/vk-mini-apps-router'
import {
  MAIN_SETTINGS,
  PAGE_MAIN,
  PAGE_MARKS,
  PAGE_NOTIFICATIONS,
  PAGE_SCHEDULE,
  PAGE_SETTINGS,
  VIEW_MARKS,
  VIEW_NOTIFICATIONS,
  VIEW_SCHEDULE,
  VIEW_SETTINGS
} from './constants.ts'

export const routes: RouteWithoutRoot[] = [
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
    path: PAGE_NOTIFICATIONS,
    panel: VIEW_NOTIFICATIONS,
    view: VIEW_SCHEDULE
  }
]
