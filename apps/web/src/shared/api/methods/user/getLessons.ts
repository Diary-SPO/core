import { diaryApi } from '@runtime-api'
import { formatDateForRequest } from '../helpers'

export const getUserLessons = async (startDate: Date, endDate: Date) => {
  const formattedStartDate = formatDateForRequest(startDate)
  const formattedEndDate = formatDateForRequest(endDate)

  return diaryApi.getLessons(formattedStartDate, formattedEndDate)
}
