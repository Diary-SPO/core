import { Capacitor, CapacitorCookies, registerPlugin } from '@capacitor/core'

interface DiaryCookiesPlugin {
  getCookies(options: { url: string }): Promise<Record<string, string>>
  setCookie(options: { url: string; key: string; value: string }): Promise<void>
}

const native = registerPlugin<DiaryCookiesPlugin>('DiaryCookies')

const toHeader = (cookies: Record<string, string>): string =>
  Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ')

// Штатный getCookies не видит HttpOnly и чужие домены.
export const getDiaryCookies = async (url: string): Promise<string> => {
  if (Capacitor.isNativePlatform()) {
    try {
      return toHeader(await native.getCookies({ url }))
    } catch (error) {
      console.warn('DiaryCookies.getCookies failed, fallback', error)
    }
  }
  return toHeader(await CapacitorCookies.getCookies({ url }))
}

export const setDiaryCookie = async (
  url: string,
  key: string,
  value: string
): Promise<void> => {
  if (Capacitor.isNativePlatform()) {
    try {
      await native.setCookie({ url, key, value })
      return
    } catch (error) {
      console.warn('DiaryCookies.setCookie failed, fallback', error)
    }
  }
  await CapacitorCookies.setCookie({ url, key, value })
}
