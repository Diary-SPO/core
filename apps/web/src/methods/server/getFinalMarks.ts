import { AttestationResponse } from '@diary-spo/shared'
import { ServerResponse } from '../../types'
import makeRequest from '../makeRequest'

export const getFinalMarks = async (): ServerResponse<AttestationResponse> => {
  const id = localStorage.getItem('id')

  return makeRequest<AttestationResponse>(`/final.marks/${id}`)
}
