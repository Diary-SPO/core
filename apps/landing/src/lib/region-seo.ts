import type { DiaryRegion } from './regions'

/** Города из aliases (кириллица), с заглавной буквы. */
export function regionCities(region: DiaryRegion): string[] {
  return region.aliases
    .filter((a) => /[а-яё]/i.test(a))
    .map((a) => a.charAt(0).toLocaleUpperCase('ru-RU') + a.slice(1))
}

/** Например: `71 (Тульская область)`. */
export function regionCodeWithName(region: DiaryRegion): string {
  return `${region.code} (${region.name})`
}

/** Например: `СПО 71 (Тульская область)`. */
export function spoCodeWithName(region: DiaryRegion): string {
  return `СПО ${region.code} (${region.name})`
}

export function regionSeoTitle(region: DiaryRegion): string {
  return `Электронный дневник СПО ${region.code} (${region.name}) — Сетевой город`
}

export function regionSeoDescription(region: DiaryRegion): string {
  const cities = regionCities(region)
  const cityPart = cities.length > 0 ? ` ${cities.slice(0, 3).join(', ')}.` : ''
  return (
    `Электронный дневник СПО и Сетевой город в регионе ${region.name} ` +
    `(код ${region.code}): портал ${new URL(region.url).hostname}, как войти, ` +
    `что делать если не открывается.` +
    cityPart
  )
}

export function regionSeoH1(region: DiaryRegion): string {
  return `Электронный дневник СПО — ${region.name}`
}

export function regionSearchPhrases(region: DiaryRegion): string[] {
  const cities = regionCities(region)
  const code = regionCodeWithName(region)
  const phrases = [
    `электронный дневник СПО ${code}`,
    `дневник СПО ${code}`,
    `Сетевой город ${region.name}`,
    `электронный дневник СПО ${region.name}`
  ]
  for (const city of cities.slice(0, 3)) {
    phrases.push(`Сетевой город ${city}`)
    phrases.push(`электронный дневник СПО ${city}`)
  }
  return phrases
}
