/** Публичный origin продакшен-сайта. */
export const SITE_ORIGIN = 'https://diary-spo.github.io'

/**
 * Путь с учётом base (`/` или `/pre/`).
 * Примеры: withBase('skachat/') → '/skachat/' или '/pre/skachat/'
 */
export function withBase(path = ''): string {
  const base = import.meta.env.BASE_URL || '/'
  const clean = path.replace(/^\//, '')
  return `${base}${clean}`
}

/** Абсолютный canonical URL для текущей сборки. */
export function canonicalUrl(path = ''): string {
  const origin = SITE_ORIGIN.replace(/\/$/, '')
  return `${origin}${withBase(path)}`
}

/** Asset из /public с учётом base. */
export function publicUrl(path: string): string {
  return withBase(path.replace(/^\.\//, '').replace(/^\//, ''))
}
