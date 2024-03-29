import { Day } from '@diary-spo/shared'
import { ServerResponse } from '../../types'
import makeRequest from '../makeRequest'
import { formatDateForRequest } from './helpers.ts'

export const getLessons = async (
  startDate: Date,
  endDate: Date
): ServerResponse<Day[]> => {
  const id = localStorage.getItem('id')

  const formattedStartDate = formatDateForRequest(startDate)
  const formattedEndDate = formatDateForRequest(endDate)

  return makeRequest<Day[]>(
    `/lessons/${id}/${formattedStartDate}/${formattedEndDate}`
  )
}
