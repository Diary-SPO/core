import { AcademicRecord } from '@diary-spo/shared'
import { ServerResponse } from '@types'
import makeRequest from '../../makeRequest.ts'

export const getFinalMarks = async (): ServerResponse<AcademicRecord> =>
  makeRequest<AcademicRecord>('/final.marks/')
