import {RequiredModel} from "../../model";

export const requiredGetByData = (diaryUserId: bigint, taskId: bigint) => RequiredModel.findOne({
    where: {
        diaryUserId,
        taskId
    }
})