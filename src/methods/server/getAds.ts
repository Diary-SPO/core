import { NotificationsResponse } from '@diary-spo/shared'
import makeRequest from './makeRequest'

export const getAds = async (): Promise<NotificationsResponse[] | 418 | 429> =>
  makeRequest<NotificationsResponse[]>('/ads')
