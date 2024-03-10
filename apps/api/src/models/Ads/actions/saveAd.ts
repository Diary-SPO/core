import { NotificationsResponse } from "@diary-spo/shared";
import { ICacheData, retriesForError } from "@helpers";
import { adSaveOrGer } from "./adSaveOrGet";

export const saveAd = async (ad: NotificationsResponse, authData: ICacheData) => {
  return retriesForError(
    adSaveOrGer,
    [ad, authData]
  )
}