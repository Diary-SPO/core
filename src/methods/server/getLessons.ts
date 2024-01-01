import { Day } from '@diary-spo/shared'
import { formatDateForRequest } from '@utils'
import { ServerResponse } from '../../types'
import makeRequest from './makeRequest'

export const getLessons = async (
  startDate?: Date,
  endDate?: Date
): ServerResponse<Day[]> => {
  const id = localStorage.getItem('id')

  if (!id) {
    return 418
  }

  if (!startDate) {
    startDate = new Date()
  }

  if (!endDate) {
    endDate = new Date()
    endDate.setDate(endDate.getDate() + 7)
  }

  const formattedStartDate = formatDateForRequest(startDate)
  const formattedEndDate = formatDateForRequest(endDate)

  return makeRequest<Day[]>(
    `/lessons/${id}/${formattedStartDate}/${formattedEndDate}`
  )
}
