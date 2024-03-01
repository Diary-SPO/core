import { ICacheData } from "@helpers";
import { RequiredModel } from "../model";

export const requiredSaveOrGet = async (isRequired: boolean, taskId: number, authData: ICacheData) => RequiredModel
.findOrCreate({
    where: {
        taskId
    },
    defaults: {
        taskId,
        isRequired,
        diaryUserId: authData.localUserId
    }
})
.then (v => {
    const result = v[0]
    if (v[1]) {
        return result
    }
    return result.update({
        isRequired
    })
})