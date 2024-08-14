import type { Treaty } from '@elysiajs/eden/treaty2'

export const isApiError = (data: unknown): data is Treaty.TreatyResponse<any> =>
  !data || typeof data !== 'object' || 'error' in data
