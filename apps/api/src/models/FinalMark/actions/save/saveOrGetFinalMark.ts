import { ICacheData } from "@helpers"
import { FinalMarkModel } from "../../model"

export const saveOrGetFinalMark = async (
  markValueId: number | null,
  subjectId: number,
  authData: ICacheData
) => {
  const where = {
    subjectId,
    diaryUserId: authData.localUserId,
  }
  return FinalMarkModel.findOrCreate({
    where,
    defaults: {
      ...where,
      markValueId
    }
  })
}
