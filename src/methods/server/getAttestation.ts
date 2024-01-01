import { AttestationResponse } from '@diary-spo/shared'
import { ServerResponse } from '../../types'
import makeRequest from './makeRequest'

export const getAttestation = async (): ServerResponse<AttestationResponse> => {
  const token = localStorage.getItem('token')
  const id = localStorage.getItem('id')

  if (!token) {
    return 418
  }

  return makeRequest<AttestationResponse>(`/attestation/${id}`)
}
