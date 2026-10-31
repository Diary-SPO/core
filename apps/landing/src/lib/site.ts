/** Публичный адрес продакшен-сайта */
export const SITE_ORIGIN = 'https://diary-spo.github.io'

/** Собирает путь с учётом base: "/" или "/pre/" */
export function withBase(path = ''): string {
  const base = import.meta.env.BASE_URL || '/'
  const clean = path.replace(/^\//, '')
  return `${base}${clean}`
}

/** Полный canonical URL для текущей сборки */
export function canonicalUrl(path = ''): string {
  const origin = SITE_ORIGIN.replace(/\/$/, '')
  return `${origin}${withBase(path)}`
}

/** URL файла из public с учётом base */
export function publicUrl(path: string): string {
  return withBase(path.replace(/^\.\//, '').replace(/^\//, ''))
}
