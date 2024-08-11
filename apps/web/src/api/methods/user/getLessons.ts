import type { Day } from '@diary-spo/shared'
import type { ServerResponse } from '@types'
import { client } from '../../client.ts'
import { formatDateForRequest } from '../helpers'

export const getLessons = async (
  startDate: Date,
  endDate: Date
): ServerResponse<Day[]> => {
  const formattedStartDate = formatDateForRequest(startDate)
  const formattedEndDate = formatDateForRequest(endDate)

  const { data } = await client
    .lessons({ startDate: formattedStartDate })({ endDate: formattedEndDate })
    .get()

  return data
}
