import {AvatarModel, AvatarModelType, IAvatarModelType} from "../../models/Avatar";
import {AvatarData} from "@diary-spo/shared";
import {ITagModelType, TagModel, TagModelType} from "../../models/Tag";
import {AvatarTagModel, AvatarTagModelType, IAvatarTagModelType} from "../../models/AvatarTag";
import {sequelize} from "@db";

interface MarketAvatarsParams {
	page: number
}

type IAvatarsFromDB = IAvatarModelType & {
	avatarTags: (IAvatarTagModelType & {
		tag: ITagModelType
	})[]
}

const elementsForPage = 100

const getMarketAvatars = async ({page}: MarketAvatarsParams): Promise<AvatarData[]> => {
	const avatars = await AvatarModel.findAll({
		limit: elementsForPage,
		offset: elementsForPage * (page - 1),
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
