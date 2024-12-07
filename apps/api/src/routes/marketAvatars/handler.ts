import { sequelize } from '@db'
import type { AvatarData } from '@diary-spo/shared'
import { AvatarModel, type IAvatarModelType } from '../../models/Avatar'
import {
  AvatarTagModel,
  type IAvatarTagModelType
} from '../../models/AvatarTag'
import { type ITagModelType, TagModel } from '../../models/Tag'

type IAvatarsFromDB = IAvatarModelType & {
  avatarTags: (IAvatarTagModelType & {
    tag: ITagModelType
  })[]
}

// TODO: ВЫНЕСТИ ВСЁ КРАСИВЕНЬКО ТУТ И ТАМ

const getMarketAvatars = async (): Promise<AvatarData[]> => {
  const avatars = (await AvatarModel.findAll({
    include: [
      {
        model: AvatarTagModel,
        include: [TagModel]
      }
    ],
    order: [[sequelize.literal('id'), 'ASC']]
  })) as IAvatarsFromDB[]

  const formattedResult: AvatarData[] = []

  for (const avatar of avatars)
    formattedResult.push({
      filename: avatar.filename,
      tags: avatar.avatarTags.map((avatarTag) => avatarTag.tag.value),
      isAnimated: avatar.isAnimated,
      price: avatar.price
    })

  return formattedResult
}

export default getMarketAvatars
