import { API_CODES, API_ERRORS, ApiError } from '@api'
import { SERVER_URL } from '@config'
import {
  DiaryUserModel,
  GroupModel,
  SPOModel,
  SPOModelType,
  getCookieFromToken
} from '@db'
import type { Organization } from '@diary-spo/shared'
import { HeadersWithCookie } from '@utils'
import type { Context } from 'elysia'
import { Optional } from 'sequelize'
import {checkSameKeys} from "../../helpers/checkDataForObject";

const getOrganization = async ({
  request
}: Context): Promise<Organization | Optional<SPOModelType, 'id'> | string> => {
  const authData = await getCookieFromToken(request.headers.toJSON().secret)
  const path = `${SERVER_URL}/services/people/organization`
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
    const record = SPOModel.findOne({
      where: {
        organizationId: response.organizationId
      },
      attributes: {
        exclude: ['id']
      }
    }).then(() => {
      if (record && !checkSameKeys(saveData, record)) {
        SPOModel.update(
          { ...saveData },
          {
            where: {
              organizationId: response.organizationId
            }
          }
        )
      }
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
