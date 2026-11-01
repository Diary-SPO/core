import { backgroundGradeNotifications } from '@runtime-api'
import {
  PAGE_SETTINGS_ABOUT,
  PAGE_SETTINGS_ACCOUNT,
  PAGE_SETTINGS_APPEARANCE,
  PAGE_SETTINGS_DEVELOPER,
  PAGE_SETTINGS_HELP,
  PAGE_SETTINGS_NOTIFICATIONS
} from '../../../app/routes'
import { isDeveloperModeUnlocked } from './developer'

export interface SettingsCatalogItem {
  id: string
  title: string
  subtitle?: string
  keywords: string[]
  path: string
  available?: () => boolean
}

export interface SettingsCategory {
  id: string
  title: string
  subtitle: string
  path: string
  keywords: string[]
  available?: () => boolean
}

export const SETTINGS_CATEGORIES: SettingsCategory[] = [
  {
    id: 'appearance',
    title: 'Оформление',
    subtitle: 'Тема приложения',
    path: PAGE_SETTINGS_APPEARANCE,
    keywords: ['оформление', 'тема', 'тёмная', 'светлая', 'авто']
  },
  {
    id: 'notifications',
    title: 'Уведомления',
    subtitle: 'Оценки в фоне',
    path: PAGE_SETTINGS_NOTIFICATIONS,
    keywords: ['уведомления', 'оценки', 'частота', 'фон', 'пуш'],
    available: () => backgroundGradeNotifications.supported
  },
  {
    id: 'account',
    title: 'Аккаунт',
    subtitle: 'Регион, кеш, диагностика',
    path: PAGE_SETTINGS_ACCOUNT,
    keywords: [
      'аккаунт',
      'регион',
      'кеш',
      'диагностика',
      'вход',
      'пинкод',
      'pin'
    ]
  },
  {
    id: 'help',
    title: 'Помощь',
    subtitle: 'FAQ и контакты',
    path: PAGE_SETTINGS_HELP,
    keywords: ['помощь', 'faq', 'вопрос', 'поддержка', 'контакты']
  },
  {
    id: 'about',
    title: 'О приложении',
    subtitle: 'Версия и документы',
    path: PAGE_SETTINGS_ABOUT,
    keywords: ['о приложении', 'версия', 'правовое', 'политика', 'соглашение']
  },
  {
    id: 'developer',
    title: 'Для разработчиков',
    subtitle: 'Техническая информация',
    path: PAGE_SETTINGS_DEVELOPER,
    keywords: ['разработчик', 'developer', 'кеш', 'localstorage', 'тех'],
    available: isDeveloperModeUnlocked
  }
]

export const SETTINGS_ITEMS: SettingsCatalogItem[] = [
  {
    id: 'theme',
    title: 'Тема приложения',
    subtitle: 'Авто, светлая или тёмная',
    keywords: ['тема', 'оформление', 'тёмная', 'светлая', 'авто'],
    path: PAGE_SETTINGS_APPEARANCE
  },
  {
    id: 'tabbar-labels',
    title: 'Подписи в нижней панели',
    subtitle: 'Показывать названия вкладок',
    keywords: ['подписи', 'tabbar', 'навигация', 'вкладки'],
    path: PAGE_SETTINGS_APPEARANCE
  },
  {
    id: 'app-icon',
    title: 'Иконка приложения',
    subtitle: 'Значок на рабочем столе',
    keywords: ['иконка', 'значок', 'ярлык', 'рабочий стол'],
    path: PAGE_SETTINGS_APPEARANCE
  },
  {
    id: 'pin',
    title: 'Пинкод входа',
    subtitle: 'Защита приложения кодом',
    keywords: ['пинкод', 'pin', 'пароль', 'блокировка', 'безопасность'],
    path: PAGE_SETTINGS_ACCOUNT
  },
  {
    id: 'grade-notifications',
    title: 'Уведомления об оценках',
    subtitle: 'Фоновая проверка оценок',
    keywords: ['уведомления', 'оценки', 'пуш', 'фон'],
    path: PAGE_SETTINGS_NOTIFICATIONS,
    available: () => backgroundGradeNotifications.supported
  },
  {
    id: 'grade-interval',
    title: 'Частота проверки оценок',
    subtitle: 'Интервал фоновой проверки',
    keywords: ['частота', 'интервал', 'оценки', 'уведомления'],
    path: PAGE_SETTINGS_NOTIFICATIONS,
    available: () => backgroundGradeNotifications.supported
  },
  {
    id: 'region',
    title: 'Регион дневника',
    subtitle: 'Смена региона ПОО',
    keywords: ['регион', 'дневник', 'город', 'область'],
    path: PAGE_SETTINGS_ACCOUNT
  },
  {
    id: 'cache',
    title: 'Очистить кеш',
    subtitle: 'Расписание, оценки и объявления',
    keywords: ['кеш', 'очистить', 'сброс', 'данные'],
    path: PAGE_SETTINGS_ACCOUNT
  },
  {
    id: 'diagnostics',
    title: 'Диагностика входа',
    subtitle: 'Проверка связи с дневником',
    keywords: ['диагностика', 'вход', 'сеть', 'сессия'],
    path: PAGE_SETTINGS_ACCOUNT
  },
  {
    id: 'faq',
    title: 'FAQ',
    subtitle: 'Частые вопросы',
    keywords: ['faq', 'помощь', 'вопрос'],
    path: PAGE_SETTINGS_HELP
  },
  {
    id: 'contacts',
    title: 'Контакты',
    subtitle: 'Поддержка и сообщество',
    keywords: ['контакты', 'поддержка', 'вк', 'телеграм'],
    path: PAGE_SETTINGS_HELP
  },
  {
    id: 'legal',
    title: 'Правовая информация',
    subtitle: 'Политика и соглашения',
    keywords: ['правовое', 'политика', 'соглашение', 'персональные'],
    path: PAGE_SETTINGS_ABOUT
  },
  {
    id: 'version',
    title: 'Версия приложения',
    keywords: ['версия', 'сборка', 'о приложении'],
    path: PAGE_SETTINGS_ABOUT
  },
  {
    id: 'tech-info',
    title: 'Техническая информация',
    subtitle: 'Содержимое LocalStorage',
    keywords: ['тех', 'localstorage', 'кеш', 'разработчик'],
    path: PAGE_SETTINGS_DEVELOPER,
    available: isDeveloperModeUnlocked
  }
]

const normalize = (value: string): string =>
  value.trim().toLocaleLowerCase('ru-RU').replace(/ё/g, 'е')

export const filterSettingsCategories = (query: string): SettingsCategory[] => {
  const q = normalize(query)
  return SETTINGS_CATEGORIES.filter((category) => {
    if (category.available && !category.available()) return false
    if (!q) return true
    return normalize(
      `${category.title} ${category.subtitle} ${category.keywords.join(' ')}`
    ).includes(q)
  })
}

export const filterSettingsItems = (query: string): SettingsCatalogItem[] => {
  const q = normalize(query)
  if (!q) return []
  return SETTINGS_ITEMS.filter((item) => {
    if (item.available && !item.available()) return false
    return normalize(
      `${item.title} ${item.subtitle ?? ''} ${item.keywords.join(' ')}`
    ).includes(q)
  })
}
