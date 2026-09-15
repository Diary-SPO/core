export function extractAuthCookie(setCookieHeader: string): string {
  return Array.from(
    setCookieHeader.matchAll(/(?:^|,\s*)([^=;,\s]+)=([^;]*)/g),
    (match) => `${match[1]}=${match[2]}`
  ).join('; ')
}
