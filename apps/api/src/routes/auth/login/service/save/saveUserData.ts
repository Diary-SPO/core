import { API_CODES, ApiError } from '@api'
import { SERVER_URL } from '@config'
import type { PersonResponse, UserData } from '@diary-spo/shared'
import { generateToken } from '@helpers'
import { cookieExtractor, error } from '@utils'
import {
  getFormattedDiaryUserData,
  saveOrGetDiaryUser,
  saveOrGetGroup
} from '../../../../../models/DiaryUser'
import { saveOrGetSPO } from '../../../../../models/SPO'
import { fetcher } from 'src/utils/fetcher'

export const saveUserData = async (
  parsedRes: UserData,
  login: string,
  password: string,
  setCookieHeader: string
) => {
  const tenant = parsedRes.tenants[parsedRes.tenantName]
  const student = tenant.studentRole.students[0]
  const SPO = tenant.settings.organization

  const cookie = cookieExtractor(setCookieHeader ?? '')
  try {
    const rawResponse = await fetcher.get(
      `${SERVER_URL}/services/security/account-settings`,
      {
        headers: {
          Cookie: cookie
        }
      }
    )

    const detailedInfo = await rawResponse.json<PersonResponse>()

    const person = detailedInfo.persons[0]

    const spoAddress =
      SPO.actualAddress.length > 5
        ? SPO.actualAddress
        : SPO.legalAddress.length > 5
          ? SPO.legalAddress
          : SPO.address.mailAddress

    const regSPO = await saveOrGetSPO({
      abbreviation: SPO.abbreviation,
      name: SPO.name,
      shortName: SPO.shortName,
      actualAddress: spoAddress,
      email: SPO.email,
      site: SPO.site,
      phone: SPO.phone,
      type: SPO.type,
      directorName: SPO.directorName,
      organizationId: SPO.organizationId
    })

    const regGroup = await saveOrGetGroup(
      student.groupId,
      student.groupName,
      regSPO.id
    )

    const regDiaryUser = await saveOrGetDiaryUser({
      groupId: regGroup.id,
      login,
      password,
      phone: person.phone,
      birthday: person.birthday,
      firstName: person.firstName,
      lastName: person.lastName,
      middleName: person.middleName,
      cookie,
      isAdmin: false,
      idFromDiary: student.id
    })

    // Генерируем токен
    const token = await generateToken(regDiaryUser.id)

    // Убираем все "приватные" поля из ответа
    return getFormattedDiaryUserData(regDiaryUser, regSPO, regGroup, token)
  } catch (err) {
    error(err)
  }
}
