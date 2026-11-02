import altaiEmblem from '../../assets/images/regions/altai.webp'
import buryatiaEmblem from '../../assets/images/regions/buryatia.webp'
import chelyabinskEmblem from '../../assets/images/regions/chelyabinsk.webp'
import ingushetiaEmblem from '../../assets/images/regions/ingushetia.webp'
import kalugaEmblem from '../../assets/images/regions/kaluga.webp'
import kamchatkaEmblem from '../../assets/images/regions/kamchatka.webp'
import karachayEmblem from '../../assets/images/regions/karachay.webp'
import komiEmblem from '../../assets/images/regions/komi.webp'
import krasnodarEmblem from '../../assets/images/regions/krasnodar.webp'
import primorskyEmblem from '../../assets/images/regions/primorsky.webp'
import ryazanEmblem from '../../assets/images/regions/ryazan.webp'
import sakhaEmblem from '../../assets/images/regions/sakha.webp'
import samaraEmblem from '../../assets/images/regions/samara.webp'
import tomskEmblem from '../../assets/images/regions/tomsk.webp'
import tulaEmblem from '../../assets/images/regions/tula.webp'
import ulyanovskEmblem from '../../assets/images/regions/ulyanovsk.webp'
import volgogradEmblem from '../../assets/images/regions/volgograd.webp'
import yamalEmblem from '../../assets/images/regions/yamal.webp'
import zabaykalskyEmblem from '../../assets/images/regions/zabaykalsky.webp'

export interface DiaryRegion {
  name: string
  url: string
  /**
   * Герб региона (поле `emblem`).
   * Гербы субъектов РФ — госсимволы (общественное достояние, PD-RU-exempt),
   * файлы взяты с Wikimedia Commons и ужаты до 96px.
   */
  emblem: string
  /**
   * Города региона и латиничные варианты названий для поиска.
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
    emblem: altaiEmblem,
    aliases: ['барнаул', 'бийск', 'рубцовск', 'barnaul', 'biysk', 'altai']
  },
  {
    name: 'Волгоградская область',
    url: 'https://spo.volganet.ru',
    emblem: volgogradEmblem,
    aliases: ['волгоград', 'волжский', 'камышин', 'volgograd', 'volzhsky']
  },
  {
    name: 'Забайкальский край',
    url: 'https://poo.zabedu.ru',
    emblem: zabaykalskyEmblem,
    aliases: ['чита', 'chita', 'zabaikalsky', 'zabaykalsky']
  },
  {
    name: 'Калужская область',
    url: 'https://spo.admoblkaluga.ru',
    emblem: kalugaEmblem,
    aliases: ['калуга', 'обнинск', 'kaluga', 'obninsk']
  },
  {
    name: 'Камчатский край',
    url: 'https://prof.sgo41.ru',
    emblem: kamchatkaEmblem,
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
    emblem: karachayEmblem,
    aliases: ['черкесск', 'карачаевск', 'cherkessk', 'cherkes', 'karachay']
  },
  {
    name: 'Краснодарский край',
    url: 'https://spo.rso23.ru',
    emblem: krasnodarEmblem,
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
    emblem: primorskyEmblem,
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
    emblem: buryatiaEmblem,
    aliases: ['улан-удэ', 'ulan-ude', 'buryatia']
  },
  {
    name: 'Республика Ингушетия',
    url: 'https://poo.edu-ri.ru',
    emblem: ingushetiaEmblem,
    aliases: ['магас', 'назрань', 'magas', 'nazran', 'ingushetia']
  },
  {
    name: 'Республика Коми',
    url: 'https://giseo-spo.rkomi.ru',
    emblem: komiEmblem,
    aliases: ['сыктывкар', 'ухта', 'воркута', 'syktyvkar', 'ukhta', 'komi']
  },
  {
    name: 'Республика Саха (Якутия)',
    url: 'https://poo.e-yakutia.ru',
    emblem: sakhaEmblem,
    aliases: ['якутск', 'yakutsk', 'yakutia', 'sakha']
  },
  {
    name: 'Рязанская область',
    url: 'https://e-college.ryazan.gov.ru',
    emblem: ryazanEmblem,
    aliases: ['рязань', 'касимов', 'скопин', 'ryazan', 'kasimov', 'skopin']
  },
  {
    name: 'Самарская область',
    url: 'https://spo.asurso.ru',
    emblem: samaraEmblem,
    aliases: ['самара', 'тольятти', 'сызрань', 'samara', 'tolyatti']
  },
  {
    name: 'Томская область',
    url: DEFAULT_DIARY_URL,
    emblem: tomskEmblem,
    aliases: ['томск', 'северск', 'tomsk', 'seversk']
  },
  {
    name: 'Тульская область',
    url: 'https://spo1.edu71.ru',
    emblem: tulaEmblem,
    aliases: ['тула', 'новомосковск', 'tula']
  },
  {
    name: 'Ульяновская область',
    url: 'https://spo.cit73.ru',
    emblem: ulyanovskEmblem,
    aliases: ['ульяновск', 'димитровград', 'ulyanovsk']
  },
  {
    name: 'Челябинская область',
    url: 'https://poo.edu-74.ru',
    emblem: chelyabinskEmblem,
    aliases: ['челябинск', 'магнитогорск', 'chelyabinsk', 'magnitogorsk']
  },
  {
    name: 'Ямало-Ненецкий АО',
    url: 'https://spo.yanao.ru',
    emblem: yamalEmblem,
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
