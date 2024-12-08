import {Nullable} from "@diary-spo/shared"
import {UserAvatarModel} from "../../../models/UserAvatar";
import {API_CODES, API_ERRORS, ApiError} from "@api";
import {DiaryUserModel} from "../../../models/DiaryUser";

type MarketUserInfo = {
	firstName: string
	lastName: string
	avatar: Nullable<string>
	balance: number
}

const userSaveAvatar = async (localUserId: bigint, stringAvatarId: string): Promise<void> => {
	const avatarId = BigInt(stringAvatarId)
	const avatarIsSetNull = avatarId === BigInt(-1)

	if (!avatarIsSetNull) {
		const userAvatar = await UserAvatarModel.findOne({where: {avatarId}})

		if (!userAvatar)
			throw new ApiError(API_ERRORS.DATA_NOT_FOUND, API_CODES.NOT_FOUND)
	}

	await DiaryUserModel.update({
			avatarId: avatarIsSetNull ? null : avatarId
		},
		{
			where: {
				id: localUserId
			}
		})
}

export default userSaveAvatar
