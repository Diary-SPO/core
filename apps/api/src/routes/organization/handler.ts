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
}: Context): Promise<Organization | Optional<SPOModelType, 'id'>> => {
  const authData = await getCookieFromToken(request.headers.toJSON().secret)
  const path = `${SERVER_URL}/services/people/organization`
  console.log(path)
  const response = await fetch(path, {
    headers: HeadersWithCookie(authData.cookie)
  }).then((res) => res.json())

  if (response) {
    const {
      abbreviation,
      name,
      shortName,
      actualAddress,
      email,
      site,
      phone,
      type,
      directorName,
      organizationId
    } = response
    /* Хотелось бы красиво по убыванию...
     * Но тогда будут не красиво "скакать" поля при разных ответах (от дневника и из базы)
     */
    const saveData: Optional<SPOModelType, 'id'> = {
      abbreviation,
      name,
      shortName,
      actualAddress,
      email,
      site,
      phone,
      type,
      directorName,
      organizationId
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
