import type { Day } from '@diary-spo/shared'
import { type ICacheData, getCookieFromToken } from '@helpers'
import type { IContext } from '@types'
import { formatDate } from '@utils'
import { getLessonsService } from './service'

interface LessonsParams {
  startDate: string
  endDate: string
  user: ICacheData
}

const getLessons = async ({
  startDate,
  endDate,
  user
}: LessonsParams): Promise<Day[]> => {
  const formattedStartDate = formatDate(startDate)
  const formattedEndDate = formatDate(endDate)

  return getLessonsService(formattedStartDate, formattedEndDate, user)
}

export default getLessons
