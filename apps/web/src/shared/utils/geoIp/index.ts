export interface GeoIpLocation {
  city?: string | null
  region?: string | null
  countryCode?: string | null
}

const GEO_IP_TIMEOUT = 6000

const fetchJsonWithTimeout = async (url: string): Promise<unknown | null> => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), GEO_IP_TIMEOUT)

  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) return null
    return (await response.json()) as unknown
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

const readString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value : null

const fromIpApi = async (): Promise<GeoIpLocation | null> => {
  const data = await fetchJsonWithTimeout('https://ipapi.co/json/')
  if (!data || typeof data !== 'object') return null

  const record = data as Record<string, unknown>
  const city = readString(record.city)
  const region = readString(record.region)
  const countryCode = readString(record.country_code)

  if (!city && !region) return null
  return { city, region, countryCode }
}

const fromFreeIpApi = async (): Promise<GeoIpLocation | null> => {
  const data = await fetchJsonWithTimeout('https://freeipapi.com/api/json')
  if (!data || typeof data !== 'object') return null

  const record = data as Record<string, unknown>
  const city = readString(record.cityName)
  const region = readString(record.regionName)
  const countryCode = readString(record.countryCode)

  if (!city && !region) return null
  return { city, region, countryCode }
}

/**
 * Определяет примерное местоположение по IP через бесплатные сервисы без ключей.
 * Возвращает null, если определить не удалось. Никогда не бросает исключение.
 */
export const fetchGeoIpLocation = async (): Promise<GeoIpLocation | null> =>
  (await fromIpApi()) ?? (await fromFreeIpApi())
