/**
 * Оставляет от куки только нужную часть, выкинув все остальные
 * @param setCookieHeader
 * @returns {string} cookie
 */
export const cookieExtractor = (setCookieHeader: string): string => {
  // Подготавливаем куку. Будет кука следующего формата UID=vSADsfgasdfADSFsadfSAD...
  return setCookieHeader
    .split(';')
    .map((value) => {
      if (value.includes('UID')) {
        return `${value}; path=/;`
      }
      if (value.includes('.AspNetCore.Cookies')) {
        return `${value}; path=/; samesite=lax; httponly`
      }
    })
    .join('')
}
