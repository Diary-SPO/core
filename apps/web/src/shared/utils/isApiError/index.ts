import type { Treaty } from '@elysiajs/eden/treaty2'

//  biome-ignore lint/suspicious/noExplicitAny: несмотря на any, тут все типизировано
export const isApiError = (data: unknown): data is Treaty.TreatyResponse<any> =>
  !data || typeof data !== 'object' || ('error' in data && data.error !== null)
