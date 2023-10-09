import { AttestationResponse } from 'diary-shared';
import { getUserId } from '../bridge/getUserId';
import makeRequest from './makeRequest';

const getAttestation = async (): Promise<AttestationResponse | 418 | 429> => {
  const id = await getUserId();

  return makeRequest<AttestationResponse>(`/attestation/${id}`);
};

export default getAttestation;
