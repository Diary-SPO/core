import type { NotificationsResponse } from '@diary-spo/shared'
import type { ServerResponse } from '@types'
import makeRequest from '../makeRequest'

export const getAds = async (): ServerResponse<NotificationsResponse[]> =>
  makeRequest<NotificationsResponse[]>('/ads')
