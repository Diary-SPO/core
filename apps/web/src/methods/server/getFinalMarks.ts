import { AcademicRecord } from '@diary-spo/shared'
import { ServerResponse } from '../../types'
import makeRequest from '../makeRequest'

export const getFinalMarks = async (): ServerResponse<AcademicRecord> => {
  const id = localStorage.getItem('id')

  return makeRequest<AcademicRecord>(`/final.marks/${id}`)
}
