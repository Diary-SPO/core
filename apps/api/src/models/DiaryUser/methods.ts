import type { ResponseLogin } from '@diary-spo/shared'
import type { IGroupModel } from '../Group'
import type { ISPOModel } from '../SPO'
import type { IDiaryUserModel } from './model'

export const getFormattedDiaryUserData = (
  diaryUser: IDiaryUserModel,
  spo: ISPOModel,
  group: IGroupModel,
  token: string
): ResponseLogin => ({
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
})
