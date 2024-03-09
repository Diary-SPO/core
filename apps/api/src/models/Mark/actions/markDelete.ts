import { ICacheData } from "@helpers";
import { MarkModel } from "@models";

export const markDelete = async (taskId: number, authData: ICacheData) => {
  MarkModel.destroy({
    where: {
      taskId,
      diaryUserId: authData.localUserId
    }
  })
}