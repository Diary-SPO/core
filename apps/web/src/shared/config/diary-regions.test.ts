import { describe, expect, test } from 'bun:test'

import {
  DEFAULT_DIARY_URL,
  DIARY_REGIONS,
  diaryRegionMatches,
  findDiaryRegionByGeo,
  getSortedDiaryRegions
} from './diary-regions.ts'

describe('diary regions', () => {
  test('contains unique HTTPS origins and the default region', () => {
    const urls = DIARY_REGIONS.map(({ url }) => new URL(url))

    expect(DIARY_REGIONS.some(({ url }) => url === DEFAULT_DIARY_URL)).toBe(
      true
    )
    expect(new Set(urls.map(({ origin }) => origin)).size).toBe(urls.length)
    expect(urls.every(({ protocol }) => protocol === 'https:')).toBe(true)
  })

  test('sorts regions by name', () => {
    expect(getSortedDiaryRegions().map(({ name }) => name)).toEqual([
      'Алтайский край',
      'Волгоградская область',
      'Забайкальский край',
      'Калужская область',
      'Камчатский край',
      'Карачаево-Черкесская Республика',
      'Краснодарский край',
      'Приморский край',
      'Республика Бурятия',
      'Республика Ингушетия',
      'Республика Коми',
      'Республика Саха (Якутия)',
      'Самарская область',
      'Томская область',
      'Тульская область',
      'Ульяновская область',
      'Челябинская область',
      'Ямало-Ненецкий АО'
    ])
  })

  test('finds regions by name and domain', () => {
    const tomsk = DIARY_REGIONS.find(({ url }) => url === DEFAULT_DIARY_URL)

    expect(tomsk).toBeDefined()
    if (!tomsk) throw new Error('Default region is missing')

    expect(diaryRegionMatches('томск', tomsk)).toBe(true)
    expect(diaryRegionMatches('poo.tomedu.ru', tomsk)).toBe(true)
    expect(diaryRegionMatches('краснодар', tomsk)).toBe(false)
  })

  test('finds regions by city aliases', () => {
    const krasnodar = DIARY_REGIONS.find(
      ({ url }) => url === 'https://spo.rso23.ru'
    )

    expect(krasnodar).toBeDefined()
    if (!krasnodar) throw new Error('Krasnodar region is missing')

    expect(diaryRegionMatches('сочи', krasnodar)).toBe(true)
    expect(diaryRegionMatches('sochi', krasnodar)).toBe(true)
    expect(diaryRegionMatches('самара', krasnodar)).toBe(false)
  })

  test('matches regions by geoip city and region', () => {
    expect(
      findDiaryRegionByGeo({ city: 'Tomsk', region: 'Tomsk Oblast' })?.url
    ).toBe(DEFAULT_DIARY_URL)
    expect(
      findDiaryRegionByGeo({ city: 'Sochi', region: 'Krasnodar Krai' })?.url
    ).toBe('https://spo.rso23.ru')
    expect(findDiaryRegionByGeo({ city: 'Северск', region: null })?.url).toBe(
      DEFAULT_DIARY_URL
    )
  })

  test('returns undefined for unknown or empty geo', () => {
    expect(
      findDiaryRegionByGeo({ city: 'Moscow', region: 'Moscow' })
    ).toBeUndefined()
    expect(findDiaryRegionByGeo(null)).toBeUndefined()
    expect(findDiaryRegionByGeo({})).toBeUndefined()
  })
})
