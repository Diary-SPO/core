import type { NotificationsResponse } from '@diary-spo/shared'
import type { ServerResponse } from '@types'
import { api } from '../api.ts'
import makeRequest from '../makeRequest'

export const getAds = async (): ServerResponse<NotificationsResponse[]> => {
  const { data } = await api.ads.get()

  return data
}
