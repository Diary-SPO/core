import {BalanceOperationModel} from "../../../models/BalanceOperation";
import {AvatarModel} from "../../../models/Avatar";
import {API_CODES, API_ERRORS, ApiError} from "@api";
import {UserAvatarModel} from "../../../models/UserAvatar";

type OperationStatus = {
	isSuccess: boolean
	currentBalance: number
}

// TODO: ВЫНЕСТИ ВСЁ КРАСИВЕНЬКО ТУТ И ТАМ

const buyAvatar = async (localUserId: bigint, strAvatarId: string): Promise<OperationStatus> => {
	const avatarId = BigInt(strAvatarId)
	const currentBalance = await BalanceOperationModel.sum('amount', {where: {diaryUserId: localUserId}})
	const avatar = await AvatarModel.findOne({where: {id: avatarId}})

	if (!avatar)
		throw new ApiError(API_ERRORS.DATA_NOT_FOUND, API_CODES.NOT_FOUND)

	if (currentBalance < avatar.price)
		return {
			isSuccess: false,
			currentBalance
		}

	const userAvatarAlready = await UserAvatarModel.findOne({
		where: {
			diaryUserId: localUserId,
			avatarId
		}
	})

	if (userAvatarAlready)
		return {
			isSuccess: false,
			currentBalance
		}

	await BalanceOperationModel.create({
		diaryUserId: localUserId,
		comment: `Покупка ${avatar.isAnimated ? 'анимированного' : 'статичного'} аватара (${avatar.id})`,
		amount: -avatar.price
	})

	await UserAvatarModel.create({
		diaryUserId: localUserId,
		avatarId
	})

	return {
		isSuccess: true,
		currentBalance
	}
}

export default buyAvatar
