import { NotificationsResponse } from '@diary-spo/shared'
import { ServerResponse } from '../../types'
import makeRequest from './makeRequest'

export const getAds = async (): ServerResponse<NotificationsResponse[]> =>
  makeRequest<NotificationsResponse[]>('/ads')
