export interface DiaryRegion {
  name: string
  url: string
  /**
   * Города региона и латиничные варианты названий.
   * Используются для поиска и для сопоставления GeoIP-ответа с регионом.
   */
  aliases: string[]
}

export const DEFAULT_DIARY_URL = 'https://poo.tomedu.ru'

/**
 * Адреса региональных систем "Сетевой город. Образование"
 */
export const DIARY_REGIONS: DiaryRegion[] = [
  {
    name: 'Алтайский край',
    url: 'https://netspo.edu22.info',
    aliases: ['барнаул', 'бийск', 'рубцовск', 'barnaul', 'biysk', 'altai']
  },
  {
    name: 'Волгоградская область',
    url: 'https://spo.volganet.ru',
    aliases: ['волгоград', 'волжский', 'камышин', 'volgograd', 'volzhsky']
  },
  {
    name: 'Забайкальский край',
    url: 'https://poo.zabedu.ru',
    aliases: ['чита', 'chita', 'zabaikalsky', 'zabaykalsky']
  },
  {
    name: 'Калужская область',
    url: 'https://spo.admoblkaluga.ru',
    aliases: ['калуга', 'обнинск', 'kaluga', 'obninsk']
  },
  {
    name: 'Камчатский край',
    url: 'https://prof.sgo41.ru',
    aliases: [
      'петропавловск-камчатский',
      'петропавловск',
      'елизово',
      'kamchatka',
      'petropavlovsk'
    ]
  },
  {
    name: 'Карачаево-Черкесская Республика',
    url: 'https://poo.kchgov.ru',
    aliases: ['черкесск', 'карачаевск', 'cherkessk', 'cherkes', 'karachay']
  },
  {
    name: 'Краснодарский край',
    url: 'https://spo.rso23.ru',
    aliases: [
      'краснодар',
      'сочи',
      'новороссийск',
      'армавир',
      'krasnodar',
      'sochi',
      'novorossiysk'
    ]
  },
  {
    name: 'Приморский край',
    url: 'https://poo.prim-edu.ru',
    aliases: [
      'владивосток',
      'находка',
      'уссурийск',
      'vladivostok',
      'nakhodka',
      'primorsky',
      'ussuriysk'
    ]
  },
  {
    name: 'Республика Бурятия',
    url: 'https://spo.obr03.ru',
    aliases: ['улан-удэ', 'ulan-ude', 'buryatia']
  },
  {
    name: 'Республика Ингушетия',
    url: 'https://poo.edu-ri.ru',
    aliases: ['магас', 'назрань', 'magas', 'nazran', 'ingushetia']
  },
  {
    name: 'Республика Коми',
    url: 'https://giseo-spo.rkomi.ru',
    aliases: ['сыктывкар', 'ухта', 'воркута', 'syktyvkar', 'ukhta', 'komi']
  },
  {
    name: 'Республика Саха (Якутия)',
    url: 'https://poo.e-yakutia.ru',
    aliases: ['якутск', 'yakutsk', 'yakutia', 'sakha']
  },
  {
    name: 'Самарская область',
    url: 'https://spo.asurso.ru',
    aliases: ['самара', 'тольятти', 'сызрань', 'samara', 'tolyatti']
  },
  {
    name: 'Томская область',
    url: DEFAULT_DIARY_URL,
    aliases: ['томск', 'северск', 'tomsk', 'seversk']
  },
  {
    name: 'Тульская область',
    url: 'https://spo1.edu71.ru',
    aliases: ['тула', 'новомосковск', 'tula']
  },
  {
    name: 'Ульяновская область',
    url: 'https://spo.cit73.ru',
    aliases: ['ульяновск', 'димитровград', 'ulyanovsk']
  },
  {
    name: 'Челябинская область',
    url: 'https://poo.edu-74.ru',
    aliases: ['челябинск', 'магнитогорск', 'chelyabinsk', 'magnitogorsk']
  },
  {
    name: 'Ямало-Ненецкий АО',
    url: 'https://spo.yanao.ru',
    aliases: [
      'салехард',
      'новый уренгой',
      'ноябрьск',
      'salekhard',
      'novy urengoy',
      'noyabrsk',
      'yamal'
    ]
  }
]

export const getDiaryDomain = (url: string) => new URL(url).hostname

const normalizeRegionText = (value: string): string =>
  value.trim().toLocaleLowerCase('ru-RU').replace(/ё/g, 'е')

export const diaryRegionMatches = (
  query: string,
  region: DiaryRegion
): boolean => {
  const normalizedQuery = normalizeRegionText(query)
  if (!normalizedQuery) return true

  return `${region.name} ${getDiaryDomain(region.url)} ${region.aliases.join(
    ' '
  )}`
    .toLocaleLowerCase('ru-RU')
    .replace(/ё/g, 'е')
    .includes(normalizedQuery)
}

export const getSortedDiaryRegions = (): DiaryRegion[] =>
  [...DIARY_REGIONS].sort((left, right) =>
    left.name.localeCompare(right.name, 'ru-RU', { sensitivity: 'base' })
  )

export interface GeoIpGuess {
  city?: string | null
  region?: string | null
}

const MIN_GEO_TOKEN_LENGTH = 4

const geoTextMatchesAlias = (geoText: string, alias: string): boolean => {
  const normalizedAlias = normalizeRegionText(alias)
  if (normalizedAlias.length < MIN_GEO_TOKEN_LENGTH) return false

  return geoText.includes(normalizedAlias) || normalizedAlias.includes(geoText)
}

const regionMatchesGeoText = (
  region: DiaryRegion,
  geoText: string
): boolean => {
  const normalizedGeo = normalizeRegionText(geoText)
  if (normalizedGeo.length < MIN_GEO_TOKEN_LENGTH) return false

  return (
    region.aliases.some((alias) => geoTextMatchesAlias(normalizedGeo, alias)) ||
    geoTextMatchesAlias(normalizedGeo, region.name)
  )
}

/**
 * Подбирает регион дневника по городу/региону из GeoIP-ответа.
 * Сначала ищет совпадение по городу, затем по региону.
 */
export const findDiaryRegionByGeo = (
  geo: GeoIpGuess | null | undefined
): DiaryRegion | undefined => {
  if (!geo) return undefined

  const { city, region } = geo

  if (city) {
    const byCity = DIARY_REGIONS.find((item) =>
      regionMatchesGeoText(item, city)
    )
    if (byCity) return byCity
  }

  if (region) {
    return DIARY_REGIONS.find((item) => regionMatchesGeoText(item, region))
  }

  return undefined
}
