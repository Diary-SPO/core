import type { NotificationsResponse } from '@diary-spo/shared'
import { type ICacheData, retriesForError } from '@helpers'
import { adSaveOrGer } from './'

export const saveAd = async (ad: NotificationsResponse, authData: ICacheData) =>
  retriesForError(adSaveOrGer, [ad, authData])
