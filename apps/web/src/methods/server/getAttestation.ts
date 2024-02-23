import { AttestationResponse } from '@diary-spo/shared'
import { ServerResponse } from '@types'
import makeRequest from '../makeRequest'

export const getAttestation = async (): ServerResponse<AttestationResponse> => {
  return makeRequest<AttestationResponse>(`/attestation/`)
}
