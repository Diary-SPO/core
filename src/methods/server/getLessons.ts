import { Day } from 'diary-shared'
import formatDateForRequest from '../../utils/formatDateForRequest'
import makeRequest from './makeRequest'

export const getLessons = async (
  startDate?: Date,
  endDate?: Date
): Promise<Day[] | 418 | 429> => {
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
