import { publicUrl } from './lib/site'

/** Внешние и публичные ссылки лендинга */
export const LINKS = {
  rustore: 'https://www.rustore.ru/catalog/app/io.github.diaryspo',
  /** APK кладётся рядом с сайтом при сборке в CI */
  apk: publicUrl('app-landing.apk'),
  vk: 'https://vk.com/diary_spo',
  github: 'https://github.com/Diary-SPO/core',
  privacy: 'https://disk.yandex.ru/i/q3875_7h9oPdvA',
  agreement: 'https://disk.yandex.ru/i/ylPeDklUN5GVCQ',
  consent: 'https://disk.yandex.ru/i/oxnrYLEWNJY7bQ'
}
