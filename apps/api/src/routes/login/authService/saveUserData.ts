import { API_CODES, ApiError } from '@api'
import { SERVER_URL } from '@config'
import { generateToken } from '@db'
import type { UserData } from '@diary-spo/shared'
import { PersonResponse } from '@diary-spo/types'
import { ResponseLoginFromDiaryUser } from '@types'
import {
  ApiResponse,
  cookieExtractor,
  error,
  fetcher,
  formatDate
} from '@utils'
import { saveOrGetDiaryUser } from './saveOrGetDiaryUser'
import { saveOrGetGroup } from './saveOrGetGroup'
import { saveOrGetSPO } from './saveOrGetSPO'

export const saveUserData = async (
  parsedRes: ApiResponse<UserData>,
  login: string,
  password: string
) => {
  try {
    const tenant = parsedRes.data.tenants[parsedRes.data.tenantName]
    const student = tenant.studentRole.students[0]
    const SPO = tenant.settings.organization

    const setCookieHeader = parsedRes.headers.get('Set-Cookie')
    const cookie = cookieExtractor(setCookieHeader ?? '')

    const detailedInfo = await fetcher<PersonResponse>({
      url: `${SERVER_URL}/services/security/account-settings`,
      cookie
    })

    if (typeof detailedInfo === 'number') {
      throw new ApiError(
        'Error get detailed info!',
        API_CODES.INTERNAL_SERVER_ERROR
      )
    }

    const person = detailedInfo.data.person

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
      cookieLastDateUpdate: formatDate(new Date().toISOString()),
      isAdmin: false,
      idFromDiary: student.id
    })

    // Генерируем токен
    const token = await generateToken(regDiaryUser.id)

    // Убираем все "приватные" поля из ответа
    return ResponseLoginFromDiaryUser(regDiaryUser, regSPO, regGroup, token)
  } catch (err) {
    error(err)
    throw new Error('Ошибка на этапе работы с базой: ')
  }
}
