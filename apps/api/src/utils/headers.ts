import { t } from 'elysia'

export type Headers = Record<string, string>

export const BaseHeaders: Headers = {
  'Content-Type': 'application/json;charset=UTF-8'
}

export const HeadersWithCookie = (cookie: string): Headers => ({
  ...BaseHeaders,
  Cookie: cookie
})
