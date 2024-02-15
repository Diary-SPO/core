import { API_CODES, ApiError } from '@api'
import { SERVER_URL } from '@config'
import { DiaryUserModel, GroupModel, SPOModel, generateToken } from '@db'
import { DiaryUser, Group, PersonResponse, SPO } from '@db'
import type { UserData } from '@diary-spo/shared'
import { ResponseLoginFromDiaryUser } from '@types'
import {
  ApiResponse,
  cookieExtractor,
  error,
  fetcher,
  formatDate
} from '@utils'

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

    const regData: DiaryUser = {
      id: student.id,
      groupId: student.groupId,
      login,
      password,
      phone: detailedInfo.data.person.phone,
      birthday: detailedInfo.data.person.birthday,
      firstName: detailedInfo.data.person.firstName,
      lastName: detailedInfo.data.person.lastName,
      middleName: detailedInfo.data.person.middleName,
      cookie,
      cookieLastDateUpdate: formatDate(new Date().toISOString())
    }

    const regSPO: SPO = {
      abbreviation: SPO.abbreviation,
      name: SPO.name,
      shortName: SPO.shortName,
      actualAddress: SPO.actualAddress,
      email: SPO.email,
      site: SPO.site,
      phone: SPO.phone,
      type: SPO.type,
      directorName: SPO.directorName
    }

    const regGroup: Group = {
      groupName: student.groupName,
      idFromDiary: student.groupId
    }

    // Определяем СПО
    const [SPORecord, SPOCreated] = await SPOModel.findOrCreate({
      where: {
        abbreviation: regSPO.abbreviation
      },
      defaults: {
        ...regSPO
      }
    })

    if (!SPOCreated) {
      SPORecord.update({ ...regSPO })
    }

    regSPO.id = SPORecord.dataValues.id

    // Определяем группу
    const [groupRecord, groupCreated] = await GroupModel.findOrCreate({
      where: {
        idFromDiary: regGroup.idFromDiary
      },
      defaults: {
        ...regGroup,
        spoId: SPORecord.dataValues.id
      }
    })

    if (!groupCreated) {
      groupRecord.update({
        ...regGroup,
        spoId: SPORecord.dataValues.id
      })
    }

    regData.groupId = groupRecord.dataValues.id

    // Определяем пользователя
    const [diaryUserRecord, diaryUserCreated] =
      await DiaryUserModel.findOrCreate({
        where: {
          id: regData.id
        },
        defaults: {
          ...regData,
          groupId: groupRecord.dataValues.id
        }
      })

    if (!diaryUserCreated) {
      diaryUserRecord.update({
        ...regData,
        groupId: groupRecord.dataValues.id
      })
    }

    // Генерируем токен
    // FIXME: there is no token in model
    regData.token = await generateToken(regData.id)

    // Убираем все "приватные" поля из ответа
    return ResponseLoginFromDiaryUser(regData, regSPO, regGroup)
  } catch (err) {
    error(err)
    throw new Error('Ошибка на этапе работы с базой: ')
  }
}
