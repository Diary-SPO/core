import { formatDateForRequest } from '../helpers'

import { api } from '../../api.ts'

export const getLessons = async (startDate: Date, endDate: Date) => {
  const formattedStartDate = formatDateForRequest(startDate)
  const formattedEndDate = formatDateForRequest(endDate)

  return api.lessons.post({
    startDate: formattedStartDate,
    endDate: formattedEndDate
  })
}
