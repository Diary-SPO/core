import { AttestationResponse } from 'diary-shared'
import makeRequest from './makeRequest'

export const getAttestation = async (): Promise<
  AttestationResponse | 418 | 429
> => {
  const cookie = localStorage.getItem('cookie')
  const id = localStorage.getItem('id')

  if (!cookie) {
    return 418
  }

  return makeRequest<AttestationResponse>(`/attestation/${id}`)
}
