export function extractAuthCookie(setCookieHeader: string): string {
  return Array.from(
    setCookieHeader.matchAll(/(?:^|,\s*)([^=;,\s]+)=([^;]*)/g),
    (match) => `${match[1]}=${match[2]}`
  ).join('; ')
}

export function mergeAuthCookies(...cookieHeaders: string[]): string {
  const cookies = new Map<string, string>()

  for (const header of cookieHeaders) {
    for (const cookie of header.split(';')) {
      const trimmedCookie = cookie.trim()
      const separator = trimmedCookie.indexOf('=')
      if (separator <= 0) continue

      const key = trimmedCookie.slice(0, separator)
      cookies.set(key, trimmedCookie)
    }
  }

  return Array.from(cookies.values()).join('; ')
}
