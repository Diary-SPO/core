import type {AvatarData} from "@diary-spo/shared";
import {API_URL} from "../../../../shared/config";

export const getUrlPath = (avatarData: AvatarData|string) => {
	return `${API_URL}/uploads/avatars/${typeof avatarData !== "string" ? avatarData.filename : avatarData}`
}