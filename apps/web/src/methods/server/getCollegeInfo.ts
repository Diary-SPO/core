import { Organization } from '@diary-spo/shared'
import { ServerResponse } from '@types'
import makeRequest from '../makeRequest'

export const getCollegeInfo = async (): ServerResponse<Organization> =>
  makeRequest<Organization>('/organization')
