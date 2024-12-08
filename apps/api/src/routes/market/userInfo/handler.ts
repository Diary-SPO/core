import {DiaryUserModel} from "../../../models/DiaryUser";
import {API_CODES, API_ERRORS, ApiError} from "@api";
import {AvatarModel} from "../../../models/Avatar";
import {Nullable} from "@diary-spo/shared";
import {BalanceOperationModel} from "../../../models/BalanceOperation";

type MarketUserInfo = {
	firstName: string
	lastName: string
	avatar: Nullable<string>
	balance: number
}

const getUserInfo = async (localUserId: bigint): Promise<MarketUserInfo> => {
	const diaryUser = await DiaryUserModel.findByPk(localUserId)

	if (!diaryUser)
		throw new ApiError(API_ERRORS.USER_NOT_FOUND, API_CODES.NOT_FOUND)

	const firstName = diaryUser.firstName
	const lastName = diaryUser.lastName

	const avatarModel = diaryUser.avatarId ?
		await AvatarModel.findByPk(diaryUser.avatarId)
		: null

	const avatar = avatarModel ? avatarModel.filename : null

	// Если нет записей, то может вернуться что-то другое (вдруг), поэтому ставим ??
	const balance = await BalanceOperationModel.sum('amount', {where: {diaryUserId: diaryUser.id}}) ?? 0

	return {
		firstName,
		lastName,
		avatar,
		balance
	}
}

export default getUserInfo
