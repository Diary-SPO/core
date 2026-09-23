export interface DiaryRegion {
  name: string
  url: string
}

export const DEFAULT_DIARY_URL = 'https://poo.tomedu.ru'

/**
 * Адреса региональных систем "Сетевой город. Образование"
 */
export const DIARY_REGIONS: DiaryRegion[] = [
  {
    name: 'Алтайский край',
    url: 'https://netspo.edu22.info'
  },
  {
    name: 'Волгоградская область',
    url: 'https://spo.volganet.ru'
  },
  {
    name: 'Забайкальский край',
    url: 'https://poo.zabedu.ru'
  },
  {
    name: 'Калужская область',
    url: 'https://spo.admoblkaluga.ru'
  },
  {
    name: 'Камчатский край',
    url: 'https://prof.sgo41.ru'
  },
  {
    name: 'Карачаево-Черкесская Республика',
    url: 'https://poo.kchgov.ru'
  },
  {
    name: 'Краснодарский край',
    url: 'https://spo.rso23.ru'
  },
  {
    name: 'Приморский край',
    url: 'https://poo.prim-edu.ru'
  },
  {
    name: 'Республика Бурятия',
    url: 'https://spo.obr03.ru'
  },
  {
    name: 'Республика Ингушетия',
    url: 'https://poo.edu-ri.ru'
  },
  {
    name: 'Республика Коми',
    url: 'https://giseo-spo.rkomi.ru'
  },
  {
    name: 'Республика Саха (Якутия)',
    url: 'https://poo.e-yakutia.ru'
  },
  {
    name: 'Самарская область',
    url: 'https://spo.asurso.ru'
  },
  {
    name: 'Томская область',
    url: DEFAULT_DIARY_URL
  },
  {
    name: 'Ульяновская область',
    url: 'https://spo.cit73.ru'
  },
  {
    name: 'Челябинская область',
    url: 'https://poo.edu-74.ru'
  },
  {
    name: 'Ямало-Ненецкий АО',
    url: 'https://spo.yanao.ru'
  }
]

export const getDiaryDomain = (url: string) => new URL(url).hostname

export const diaryRegionMatches = (
  query: string,
  region: DiaryRegion
): boolean => {
  const normalizedQuery = query.trim().toLocaleLowerCase('ru-RU')
  if (!normalizedQuery) return true

  return `${region.name} ${getDiaryDomain(region.url)}`
    .toLocaleLowerCase('ru-RU')
    .includes(normalizedQuery)
}

export const getSortedDiaryRegions = (): DiaryRegion[] =>
  [...DIARY_REGIONS].sort((left, right) =>
    left.name.localeCompare(right.name, 'ru-RU', { sensitivity: 'base' })
  )
