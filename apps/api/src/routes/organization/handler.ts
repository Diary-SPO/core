import type { Optional } from 'sequelize'

import { API_CODES, API_ERRORS, ApiError } from '@api'
import { SERVER_URL } from '@config'
import { HeadersWithCookie } from '@utils'
import ky from 'ky'
import { DiaryUserModel } from '../../models/DiaryUser'
import { GroupModel } from '../../models/Group'
import { SPOModel, type SPOModelType } from '../../models/SPO'

interface Data {
  cookie: string
  userId: bigint
}

const getOrganization = async ({
  cookie,
  userId
}: Data): Promise<Optional<SPOModelType, 'id'>> => {
  const path = `${SERVER_URL}/services/people/organization`

  const rawResponse = await ky.get(path, {
    headers: HeadersWithCookie(cookie),
    timeout: 10000 // 10 seconds
  })

  const response = await rawResponse.json<any>()

  if (response) {
    /* Хотелось бы красиво по убыванию...
     * Но тогда будут не красиво "скакать" поля при разных ответах (от дневника и из базы)
     */
    const saveData = {
      abbreviation: response.abbreviation,
      name: response.name,
      shortName: response.shortName,
      actualAddress: response.actualAddress,
      email: response.email,
      site: response.site,
      phone: response.phone,
      type: response.type,
      directorName: response.directorName,
      organizationId: response.organizationId
    }

    // Тут сохраняем в фоне, чтобы не задерживать
    SPOModel.findOne({
      where: {
        organizationId: response.organizationId
      }
    }).then((result) => {
      if (!result) {
        return
      }
      result.update({
        ...saveData
      })
    })

    // Отдаём данные
    return saveData
  }

  // Если дневник не доступен
  const localData = (
    await SPOModel.findOne({
      where: {
        id: (
          await GroupModel.findByPk(
            (
              await DiaryUserModel.findByPk(userId)
            )?.groupId
          )
        )?.spoId
      }
    })
  )?.toJSON()

  if (!localData) {
    throw new ApiError(
      API_ERRORS.DATA_NOT_FOUND,
      API_CODES.INTERNAL_SERVER_ERROR
    )
  }

  return localData
}

export default getOrganization
