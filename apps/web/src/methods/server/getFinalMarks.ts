import { AcademicRecord } from '@diary-spo/shared'
import { ServerResponse } from '@types'
import makeRequest from '../makeRequest'

export const getFinalMarks = async (): ServerResponse<AcademicRecord> =>
  makeRequest<AcademicRecord>('/final.marks/')
