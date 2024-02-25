import { RequiredModel } from '@db'
import { IUserInfo } from './diaryUser'

export const RequiredSaveOrGet = async (
  taskId: number,
  isRequired: boolean,
  userInfo: IUserInfo
) => {
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

  if (!isCreated && record.isRequired !== isRequired) {
    return await record.update({
      ...data
    })
  }

  return record
}
