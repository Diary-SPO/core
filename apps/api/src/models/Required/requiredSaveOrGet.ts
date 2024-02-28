import { IUserInfo } from '../DiaryUser'
import { RequiredModel } from './model'

export const requiredSaveOrGet = async (
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
    return record.update({
      ...data
    })
  }

  return record
}