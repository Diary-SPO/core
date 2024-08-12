import type { Day } from '@diary-spo/shared'
import type { ICacheData } from '@helpers'
import { formatDate } from '@utils'
import { ContextWithID } from '../../types'
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
