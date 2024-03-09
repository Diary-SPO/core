import { MarkKeys } from "@diary-spo/shared";
import { ICacheData, retriesForError } from "@helpers";
import { MarkModel } from "../model";
import { markValueSaveOrGet } from "src/models/MarkValue";
import { markSaveOrGetUnSafe } from "./markSaveOrGetUnSafe";

export const markSaveOrGet = async (mark: MarkKeys, taskId: number, termId: number, authData: ICacheData) => {
  const markValueId = (await retriesForError(
    markValueSaveOrGet,
    [mark]
  )).id

  const markDB = await retriesForError(
    markSaveOrGetUnSafe,
    [markValueId, taskId, termId, authData]
  )

  // Если есть изменения, то он потом сохранит
  markDB[0].markValueId = markValueId
  
  return markDB[0].save()
}