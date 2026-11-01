export const VIEW_SCHEDULE = 'schedule'
export const VIEW_MARKS = 'marks'
export const VIEW_SETTINGS = 'settings'
export const VIEW_SETTINGS_APP = 'settings-app'
export const VIEW_SETTINGS_APPEARANCE = 'settings-appearance'
export const VIEW_SETTINGS_NOTIFICATIONS = 'settings-notifications'
export const VIEW_SETTINGS_ACCOUNT = 'settings-account'
export const VIEW_SETTINGS_HELP = 'settings-help'
export const VIEW_SETTINGS_ABOUT = 'settings-about'
export const VIEW_SETTINGS_DEVELOPER = 'settings-developer'
export const VIEW_NOTIFICATIONS = 'notifications'

export const MAIN_SETTINGS = 'login'

export const PAGE_MAIN = '/'
export const PAGE_SCHEDULE = `/${VIEW_SCHEDULE}`
export const PAGE_MARKS = `/${VIEW_MARKS}`
export const PAGE_SETTINGS = `/${VIEW_SETTINGS}`
export const PAGE_SETTINGS_APP = `/${VIEW_SETTINGS_APP}`
export const PAGE_SETTINGS_APPEARANCE = `/${VIEW_SETTINGS_APPEARANCE}`
export const PAGE_SETTINGS_NOTIFICATIONS = `/${VIEW_SETTINGS_NOTIFICATIONS}`
export const PAGE_SETTINGS_ACCOUNT = `/${VIEW_SETTINGS_ACCOUNT}`
export const PAGE_SETTINGS_HELP = `/${VIEW_SETTINGS_HELP}`
export const PAGE_SETTINGS_ABOUT = `/${VIEW_SETTINGS_ABOUT}`
export const PAGE_SETTINGS_DEVELOPER = `/${VIEW_SETTINGS_DEVELOPER}`
export const PAGE_NOTIFICATIONS = `/${VIEW_NOTIFICATIONS}`

export const isSettingsPanel = (panel?: string | null): boolean =>
  panel === VIEW_SETTINGS || Boolean(panel?.startsWith('settings-'))
