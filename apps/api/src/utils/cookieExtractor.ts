/**
 * Оставляет от куки только нужную часть, выкинув все остальные
 * @param setCookieHeader
 * @returns {string} cookie
 */
export const cookieExtractor = (setCookieHeader: string): string => {
  return extractAuthCookie(setCookieHeader)
}
import { extractAuthCookie } from '@diary-spo/diary-client'
