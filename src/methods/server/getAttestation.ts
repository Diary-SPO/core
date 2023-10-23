import { AttestationResponse } from 'diary-shared';
import { getUserId } from '../bridge/getUserId';
import makeRequest from './makeRequest';

const getAttestation = async (): Promise<AttestationResponse | 418 | 429> => {
  const cookie = localStorage.getItem('cookie');
  const id = await getUserId();

  if (!cookie) {
    return 418;
  }

  return makeRequest<AttestationResponse>(`/attestation/${id}`);
};

export default getAttestation;
