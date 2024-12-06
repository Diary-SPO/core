import {AvatarModel, AvatarModelType, IAvatarModelType} from "../../models/Avatar";
import {AvatarData} from "@diary-spo/shared";
import {ITagModelType, TagModel, TagModelType} from "../../models/Tag";
import {AvatarTagModel, AvatarTagModelType, IAvatarTagModelType} from "../../models/AvatarTag";
import {sequelize} from "@db";

type IAvatarsFromDB = IAvatarModelType & {
	avatarTags: (IAvatarTagModelType & {
		tag: ITagModelType
	})[]
}

// TODO: ВЫНЕСТИ ВСЁ КРАСИВЕНЬКО ТУТ И ТАМ

const getMarketAvatars = async (): Promise<AvatarData[]> => {
	const avatars = await AvatarModel.findAll({
		include: [
			{
				model: AvatarTagModel,
				include: [TagModel]
			}
		],
		order: [[sequelize.literal('id'), 'ASC']]
	}) as IAvatarsFromDB[]

	const formattedResult: AvatarData[] = []

	for (const avatar of avatars)
		formattedResult.push({
			filename: avatar.filename,
			tags: avatar.avatarTags.map(avatarTag => avatarTag.tag.value),
			isAnimated: avatar.isAnimated,
			price: avatar.price
		})

	return formattedResult
}

export default getMarketAvatars
