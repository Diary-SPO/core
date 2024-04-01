import type { Day } from '@diary-spo/shared'

import { getCookieFromToken } from '@helpers'
import type { IContext } from '@types'
import { formatDate } from '@utils'

import { getLessonsService } from './service'

const getLessons = async ({
  request,
  body
}: IContext): Promise<Day[] | string> => {
  // todo: типизировать
  const { startDate, endDate } = body

  const formattedStartDate = formatDate(startDate)
  const formattedEndDate = formatDate(endDate)

  const authData = await getCookieFromToken(request.headers.toJSON().secret)

  return getLessonsService(formattedStartDate, formattedEndDate, authData)
}

export default getLessons
