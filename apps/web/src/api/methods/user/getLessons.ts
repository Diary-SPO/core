import type { Day } from '@diary-spo/shared'
import type { ServerResponse } from '@types'
import makeRequest from '../../makeRequest.ts'
import { formatDateForRequest } from '../helpers'

export const getLessons = async (
  startDate: Date,
  endDate: Date
): ServerResponse<Day[]> => {
  const formattedStartDate = formatDateForRequest(startDate)
  const formattedEndDate = formatDateForRequest(endDate)

  return makeRequest<Day[]>(
    `/lessons/${formattedStartDate}/${formattedEndDate}`
  )
}
