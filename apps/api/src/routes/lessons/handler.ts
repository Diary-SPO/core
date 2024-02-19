import { getCookieFromToken } from '@db'
import type { Day } from '@diary-spo/shared'
import { IContext } from '@types'
import { formatDate } from '@utils'
import { getLessonsService } from './lessonsService'

const getLessons = async ({
  request,
  params
}: IContext): Promise<Day[] | string> => {
  const { startDate, endDate } = params

  const formattedStartDate = formatDate(startDate)
  const formattedEndDate = formatDate(endDate)

  const authData = await getCookieFromToken(request.headers.toJSON().secret)

  return getLessonsService(formattedStartDate, formattedEndDate, authData.idFromDiary, authData.cookie)
}

export default getLessons
