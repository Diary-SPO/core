import { Organization } from '@diary-spo/shared'
import makeRequest from './makeRequest'

export const getCollegeInfo = async (): Promise<Organization | 418 | 429> =>
  makeRequest<Organization>('/organization')
