import { IUserInfo } from "./diaryUser"
import { RequiredModel } from "../models"

export const RequiredSaveOrGet = async (taskId: number, isRequired: boolean, userInfo: IUserInfo) => {
  const data = {
    taskId,
    diaryUserId: userInfo.id,
    isRequired
  }

  const [record, isCreated] = await RequiredModel.findOrCreate({
    where: {
      taskId,
      diaryUserId: userInfo.id
    },
    defaults: {
      ...data
    }
  })

  if (!isCreated && record.isRequired != isRequired) {
    return await record.update({
      ...data
    })
  }

  return record
}