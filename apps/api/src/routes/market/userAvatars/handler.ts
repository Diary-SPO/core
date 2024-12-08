import type { AvatarData } from '@diary-spo/shared'
import {IUserAvatarModelType, UserAvatarModel} from "../../../models/UserAvatar";
import {AvatarModel, IAvatarModelType} from "../../../models/Avatar";
import {DiaryUserModel} from "../../../models/DiaryUser";

type IAvatarsFromDB = IUserAvatarModelType & {
  avatar: IAvatarModelType
}

type UserAvatarData = AvatarData & {isActive: boolean}

const getUserAvatars = async (localUserId: bigint): Promise<UserAvatarData[]> => {
  const currentUserAvatar = (await DiaryUserModel.findByPk(localUserId))?.avatarId ?? null
  const userAvatars = (await UserAvatarModel.findAll({
    where: {
      diaryUserId: localUserId,
    },
    include: {
      model: AvatarModel
    }
  })) as IAvatarsFromDB[]

  const formattedResult: UserAvatarData[] = []

  for (const userAvatar of userAvatars)
      formattedResult.push({
        id: userAvatar.avatar.id,
        filename: userAvatar.avatar.filename,
        tags: [],
        isAnimated: userAvatar.avatar.isAnimated,
        price: userAvatar.avatar.price,
        isActive: currentUserAvatar === userAvatar.avatarId
      })

  return formattedResult
}

export default getUserAvatars
