import { AttestationResponse } from '@diary-spo/shared'
import { ServerResponse } from '@types'
import makeRequest from '../../makeRequest.ts'

export const getAttestation = async (): ServerResponse<AttestationResponse> =>
  makeRequest<AttestationResponse>('/attestation/')
