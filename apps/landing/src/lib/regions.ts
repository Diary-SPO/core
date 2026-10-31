export interface DiaryRegion {
  id: string
  name: string
  url: string
  code: string
  aliases: string[]
  hasEsiaOnly?: boolean
  note?: string
}

export const REGIONS: DiaryRegion[] = [
  {
    id: 'altai',
    name: 'Алтайский край',
    url: 'https://netspo.edu22.info',
    code: '22',
    aliases: ['барнаул', 'бийск', 'рубцовск', 'barnaul', 'biysk', 'altai']
  },
  {
    id: 'volgograd',
    name: 'Волгоградская область',
    url: 'https://spo.volganet.ru',
    code: '34',
    aliases: ['волгоград', 'волжский', 'камышин', 'volgograd', 'volzhsky']
  },
  {
    id: 'zabaykalsky',
    name: 'Забайкальский край',
    url: 'https://poo.zabedu.ru',
    code: '75',
    aliases: ['чита', 'chita', 'zabaikalsky', 'zabaykalsky']
  },
  {
    id: 'kaluga',
    name: 'Калужская область',
    url: 'https://spo.admoblkaluga.ru',
    code: '40',
    aliases: ['калуга', 'обнинск', 'kaluga', 'obninsk']
  },
  {
    id: 'kamchatka',
    name: 'Камчатский край',
    url: 'https://prof.sgo41.ru',
    code: '41',
    aliases: [
      'петропавловск-камчатский',
      'петропавловск',
      'елизово',
      'kamchatka',
      'petropavlovsk'
    ]
  },
  {
    id: 'karachay',
    name: 'Карачаево-Черкесская Республика',
    url: 'https://poo.kchgov.ru',
    code: '09',
    aliases: ['черкесск', 'карачаевск', 'cherkessk', 'cherkes', 'karachay']
  },
  {
    id: 'krasnodar',
    name: 'Краснодарский край',
    url: 'https://spo.rso23.ru',
    code: '23',
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
    id: 'primorsky',
    name: 'Приморский край',
    url: 'https://poo.prim-edu.ru',
    code: '25',
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
    id: 'buryatia',
    name: 'Республика Бурятия',
    url: 'https://spo.obr03.ru',
    code: '03',
    aliases: ['улан-удэ', 'ulan-ude', 'buryatia']
  },
  {
    id: 'ingushetia',
    name: 'Республика Ингушетия',
    url: 'https://poo.edu-ri.ru',
    code: '06',
    aliases: ['магас', 'назрань', 'magas', 'nazran', 'ingushetia']
  },
  {
    id: 'komi',
    name: 'Республика Коми',
    url: 'https://giseo-spo.rkomi.ru',
    code: '11',
    aliases: ['сыктывкар', 'ухта', 'воркута', 'syktyvkar', 'ukhta', 'komi']
  },
  {
    id: 'sakha',
    name: 'Республика Саха (Якутия)',
    url: 'https://poo.e-yakutia.ru',
    code: '24',
    aliases: ['якутск', 'yakutsk', 'yakutia', 'sakha']
  },
  {
    id: 'samara',
    name: 'Самарская область',
    url: 'https://spo.asurso.ru',
    code: '63',
    aliases: ['самара', 'тольятти', 'сызрань', 'samara', 'tolyatti']
  },
  {
    id: 'tomsk',
    name: 'Томская область',
    url: 'https://poo.tomedu.ru',
    code: '70',
    aliases: ['томск', 'северск', 'tomsk', 'seversk']
  },
  {
    id: 'tula',
    name: 'Тульская область',
    url: 'https://spo1.edu71.ru',
    code: '71',
    aliases: ['тула', 'новомосковск', 'tula'],
    hasEsiaOnly: true,
    note: 'С 1 декабря 2024 года вход только через ЕСИА'
  },
  {
    id: 'ulyanovsk',
    name: 'Ульяновская область',
    url: 'https://spo.cit73.ru',
    code: '73',
    aliases: ['ульяновск', 'димитровград', 'ulyanovsk']
  },
  {
    id: 'chelyabinsk',
    name: 'Челябинская область',
    url: 'https://poo.edu-74.ru',
    code: '74',
    aliases: ['челябинск', 'магнитогорск', 'chelyabinsk', 'magnitogorsk']
  },
  {
    id: 'yamal',
    name: 'Ямало-Ненецкий АО',
    url: 'https://spo.yanao.ru',
    code: '89',
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
