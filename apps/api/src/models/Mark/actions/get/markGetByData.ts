import type {ICacheData} from "@helpers";
import {MarkModel} from "../../model";

export const markGetByData = async (taskId: bigint, authData: ICacheData) =>
    MarkModel.findOne({
        where: {
            taskId,
            diaryUserId: authData.localUserId
        }
    })
