import { client } from '../../client.ts'
import { formatDateForRequest } from '../helpers'

export const getUserLessons = async (startDate: Date, endDate: Date) => {
  const formattedStartDate = formatDateForRequest(startDate)
  const formattedEndDate = formatDateForRequest(endDate)

  return client
    .lessons({ startDate: formattedStartDate })({ endDate: formattedEndDate })
    .get()
}
