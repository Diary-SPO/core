import type { IDiaryUserModel, IGroupModel, ISPOModel } from '@db'
import { ResponseLogin } from '@diary-spo/types'

export function ResponseLoginFromDiaryUser(
  diaryUser: IDiaryUserModel,
  spo: ISPOModel,
  group: IGroupModel,
  token: string
): ResponseLogin {
  return {
    id: diaryUser.id,
    groupId: diaryUser.groupId,
    groupName: group.groupName,
    organization: {
      abbreviation: spo.abbreviation,
      addressSettlement: spo.actualAddress
    },
    login: diaryUser.login,
    phone: diaryUser.phone,
    birthday: diaryUser.birthday,
    firstName: diaryUser.firstName,
    lastName: diaryUser.lastName,
    middleName: diaryUser.middleName,
    spoId: spo.id,
    token
  }
}
