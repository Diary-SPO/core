import type { Organization } from '@diary-spo/shared'
import type { Context } from 'elysia'
import type { Optional } from 'sequelize'

import {
  DiaryUserModel,
  GroupModel,
  SPOModel,
  type SPOModelType
} from '@models'

import { API_CODES, API_ERRORS, ApiError } from '@api'
import { SERVER_URL } from '@config'
import { getCookieFromToken } from '@helpers'
import { HeadersWithCookie } from '@utils'

const getOrganization = async ({
  request
}: Context): Promise<Organization | Optional<SPOModelType, 'id'> | string> => {
  const authData = await getCookieFromToken(request.headers.toJSON().secret)
  const path = `${SERVER_URL}/services/people/organization`
  console.log(path)
  const response = await fetch(path, {
    headers: HeadersWithCookie(authData.cookie)
  }).then((res) => res.json())

  if (response) {
    /* Хотелось бы красиво по убыванию...
     * Но тогда будут не красиво "скакать" поля при разных ответах (от дневника и из базы)
     */
    const saveData: Optional<SPOModelType, 'id'> = {
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
    // FIXME: это што........
    // ?
    const record = SPOModel.findOne({
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
              await DiaryUserModel.findByPk(authData.localUserId)
            )?.groupId
          )
        )?.spoId
      },
      attributes: {
        exclude: ['id']
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
